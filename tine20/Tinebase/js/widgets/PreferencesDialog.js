/*
 * Tine 2.0
 * 
 * @package     Tinebase
 * @subpackage  widgets
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2009 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id$
 *
 * @todo        add app tree view
 * @todo        add admin mode
 * @todo        add lock to force prefs
 * @todo        show prefs for all apps
 * @todo        add filter toolbar
 * @todo        add preference label translations
 * @todo        use proxy store?
 * @todo        update js registry?
 */

Ext.namespace('Tine.widgets');

Ext.namespace('Tine.widgets.dialog');

/**
 * 'Edit Preferences' dialog
 */
/**
 * @class Tine.widgets.dialog.Preferences
 * @extends Ext.FormPanel
 * @constructor
 * @param {Object} config The configuration options.
 */
Tine.widgets.dialog.Preferences = Ext.extend(Ext.FormPanel, {
    /**
     * @cfg {Array} tbarItems
     * additional toolbar items (defaults to false)
     */
    tbarItems: false,
    
    /**
     * @property window {Ext.Window|Ext.ux.PopupWindow|Ext.Air.Window}
     */
    /**
     * @property {Number} loadRequest 
     * transaction id of loadData request
     */
    /**
     * @property loadMask {Ext.LoadMask}
     */
    
    /**
     * @property {Locale.gettext} i18n
     */
    i18n: null,

    /**
     * @property {Tine.widgets.dialog.PreferencesCardPanel} prefsPanel
     */
    prefsPanel: null,
    
    // private
    bodyStyle:'padding:5px',
    layout: 'fit',
    cls: 'tw-editdialog',
    anchor:'100% 100%',
    //deferredRender: false,
    buttonAlign: 'right',
    
    //private
    initComponent: function(){
        this.addEvents(
            /**
             * @event cancel
             * Fired when user pressed cancel button
             */
            'cancel',
            /**
             * @event saveAndClose
             * Fired when user pressed OK button
             */
            'saveAndClose',
            /**
             * @event update
             * @desc  Fired when the record got updated
             * @param {Json String} data data of the entry
             */
            'update'
        );
        
        this.i18n = new Locale.Gettext();
        this.i18n.textdomain('Tinebase');
        
        // init actions
        this.initActions();
        // init buttons and tbar
        this.initButtons();
        // init preferences
        this.initPreferences();
        // get items for this dialog
        this.items = this.getItems();
        
        Tine.widgets.dialog.Preferences.superclass.initComponent.call(this);
    },
    
    /**
     * init actions
     */
    initActions: function() {
        this.action_saveAndClose = new Ext.Action({
            //requiredGrant: 'editGrant',
            text: _('Ok'),
            minWidth: 70,
            scope: this,
            handler: this.onSaveAndClose,
            iconCls: 'action_saveAndClose'
        });
    
        this.action_cancel = new Ext.Action({
            text: _('Cancel'),
            minWidth: 70,
            scope: this,
            handler: this.onCancel,
            iconCls: 'action_cancel'
        });
    },
    
    /**
     * init buttons
     */
    initButtons: function() {
        var genericButtons = [
//            this.action_delete
        ];
        
        this.buttons = [
            this.action_cancel,
            this.action_saveAndClose
        ];
       
        if (this.tbarItems) {
            this.tbar = new Ext.Toolbar({
                items: this.tbarItems
            });
        }
    },
    
    /**
     * init preferences to edit (does nothing at the moment)
     */
    initPreferences: function() {
    },
    
    /**
     * returns dialog
     * 
     * NOTE: when this method gets called, all initalisation is done.
     */
    getItems: function() {
    	this.prefsPanel = new Tine.widgets.dialog.PreferencesCardPanel({
            region: 'center'
        });
        return [{
        	xtype: 'panel',
        	//title: this.i18n._('Preferences'),
            autoScroll: true,
            border: true,
            frame: true,
            layout: 'border',
            height: 424,
            items: [{
                region: 'west',
                xtype: 'panel',
                title: _('Applications'),
                html: 'tree panel',
                width: 200,
                frame: true
            }, this.prefsPanel]
        }];
    },
    
    /**
     * @private
     */
    onRender : function(ct, position){
        Tine.widgets.dialog.Preferences.superclass.onRender.call(this, ct, position);
        this.loadMask = new Ext.LoadMask(ct, {msg: _('Loading ...')});
        //this.loadMask.show();
    },
    
    /**
     * @private
     */
    onCancel: function(){
        this.fireEvent('cancel');
        this.purgeListeners();
        this.window.close();
    },
    
    /**
     * @private
     */
    onSaveAndClose: function(button, event){
        this.onApplyChanges(button, event, true);
        this.fireEvent('saveAndClose');
    },
    
    /**
     * generic apply changes handler
     * 
     * @todo add app name (from panel) to data array
     * @todo only reload if special values have changed?
     */
    onApplyChanges: function(button, event, closeWindow) {
    	
    	this.loadMask.show();
    	
    	// get values from card panels
    	var data = {};
    	for (var i=0; i < this.prefsPanel.items.items.length; i++) {
    		var formPanel = this.prefsPanel.items.items[i];
    		for (var j=0; j < formPanel.items.length; j++) {
    			data[formPanel.items.items[j].name] = formPanel.items.items[j].getValue();
    		}
    	}
    	
    	// save preference data
    	//console.log(data);
    	Ext.Ajax.request({
            scope: this,
            params: {
                method: 'Tinebase.savePreferences',
                applicationName: 'Tinebase',
                data: Ext.util.JSON.encode(data)
            },
            success: function(response) {
                this.loadMask.hide();
                
                // reload mainscreen 
                var mainWindow = Ext.ux.PopupWindowGroup.getMainWindow(); 
                mainWindow.location = window.location.href.replace(/#+.*/, '');
                
                if (closeWindow) {
                    this.purgeListeners();
                    this.window.close();
                }
            },
            failure: function (response) {
                Ext.MessageBox.alert(_('Errors'), _('Saving of preferences failed.'));    
            }
        });
    }    
});

/**
 * preferences card panel
 * -> this panel is filled with the preferences subpanels containing the pref stores for the apps
 * 
 */
Tine.widgets.dialog.PreferencesCardPanel = Ext.extend(Ext.Panel, {
    
    //private
    layout: 'card',
    border: true,
    //frame: true,
    labelAlign: 'top',
    autoScroll: true,
    defaults: {
        anchor: '100%',
        labelSeparator: ''
    },
    
    initComponent: function() {
        this.title = _('Preferences');
        this.initPrefStore();
        Tine.widgets.dialog.PreferencesCardPanel.superclass.initComponent.call(this);
    },
    
    /**
     * init app preferences store
     * 
     * @todo add applicationName as param
     * @todo add filter
     * @todo use generic json backend here?
     * @todo move this function to another place?
     */
    initPrefStore: function() {
        var store = new Ext.data.JsonStore({
            fields: Tine.Tinebase.Model.Preference,
            baseParams: {
                method: 'Tinebase.searchPreferencesForApplication',
                applicationName: 'Tinebase',
                filter: ''
            },
            listeners: {
                load: this.onStoreLoad,
                scope: this
            },
            root: 'results',
            totalProperty: 'totalcount',
            id: 'id',
            remoteSort: false
        });
        
        //console.log('loading store...');
        store.load();
    },

    /**
     * called after a new set of Records has been loaded
     * 
     * @param  {Ext.data.Store} this.store
     * @param  {Array}          loaded records
     * @param  {Array}          load options
     * @return {Void}
     */
    onStoreLoad: function(store, records, options) {
        //console.log('loaded');
        var card = new Tine.widgets.dialog.PreferencesPanel({
            prefStore: store
        });
        this.add(card);
        this.layout.container.add(card);
        this.layout.setActiveItem(card.id);
        card.doLayout();
    }
});

/**
 * preferences panel with the preference input fields for an application
 * 
 */
Tine.widgets.dialog.PreferencesPanel = Ext.extend(Ext.Panel, {
    
	/**
	 * the prefs store
	 * @cfg {Ext.data.Store}
	 */
	prefStore: null,
	
    /**
     * @cfg {string} app name
     */
    appName: 'Tinebase',
	
    //private
    layout: 'form',
	//layout: 'fit',
    border: true,
    labelAlign: 'top',
    autoScroll: true,
    defaults: {
        anchor: '95%',
        labelSeparator: ''
    },
    bodyStyle: 'padding:5px',
    
    initComponent: function() {
        if (this.prefStore) {
            
            this.items = [];
            this.prefStore.each(function(pref) {
            	//if (pref.get('name') === 'timezone') {
            	//	this.items.push(new Tine.widgets.TimezoneChooser({}));
            	//} else if (pref.get('name') === 'locale') {
            	//	this.items.push(new Tine.widgets.LangChooser({}));
            	//}
            		
        	    // check if options avExt.ux.PopupWindowGroup.getMainWindowailable -> use combobox
                var fieldDef = {
                    fieldLabel: _(pref.get('name')),
                    //name: 'pref_' + pref.get('name'),
                    name: pref.get('name'),
                    value: pref.get('value'),
                    xtype: (pref.get('options') && pref.get('options').length > 0) ? 'combo' : 'textfield'
                };
                
                if (pref.get('options') && pref.get('options').length > 0) {
                	// add additional combobox config
                	fieldDef.store = pref.get('options');
                	fieldDef.mode = 'local';
                    fieldDef.forceSelection = true;
                    fieldDef.triggerAction = 'all';
                    
                    if (pref.get('name') === 'locale') {
                    	console.log(pref.get('options'));
                    	/*
                        this.tpl = new Ext.XTemplate(
                            '<tpl for=".">' +
                                '<div class="x-combo-list-item">' +
                                    '{language} <tpl if="region.length &gt; 1">{region}</tpl> [{locale}]' + 
                                '</div>' +
                            '</tpl>',{
                                encode: function(value) {
                                    return Ext.util.Format.htmlEncode(value);
                                }
                            }
                        );
                        */
                    }
                }
                
                console.log(fieldDef);
                try {
                    var fieldObj = Ext.ComponentMgr.create(fieldDef);
                    this.items.push(fieldObj);
                    
                    // ugh a bit ugly
                    pref.fieldObj = fieldObj;
                } catch (e) {
                	//console.log(e);
                    console.error('Unable to create preference field "' + pref.get('name') + '". Check definition!');
                    this.prefStore.remove(pref);
                }
            }, this);

        } else {
            this.html = '<div class="x-grid-empty">' + _('There are no preferences yet') + "</div>";
        }
        //console.log(this.items);
        
        Tine.widgets.dialog.PreferencesPanel.superclass.initComponent.call(this);
    }
});

/**
 * Timetracker Edit Popup
 */
Tine.widgets.dialog.Preferences.openWindow = function (config) {
    //var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 800,
        height: 470,
        name: 'Preferences',
        contentPanelConstructor: 'Tine.widgets.dialog.Preferences',
        contentPanelConstructorConfig: config
    });
    return window;
};
