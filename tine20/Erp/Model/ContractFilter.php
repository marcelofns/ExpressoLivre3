<?php
/**
 * Tine 2.0
 * 
 * @package     Erp
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id$
 *
 * @todo        extend Tinebase_Record_Filter_Abstract
 */

/**
 * contract filter Class
 * @package     Erp
 */
class Erp_Model_ContractFilter extends Tinebase_Record_Abstract
{
	/**
     * key in $_validators/$_properties array for the field which 
     * represents the identifier
     * 
     * @var string
     */    
    protected $_identifier = 'id';
    
    /**
     * application the record belongs to
     *
     * @var string
     */
    protected $_application = 'Erp';
    
    /**
     * zend validators
     *
     * @var array
     */
    protected $_validators = array(
        'id'                   => array('allowEmpty' => true,  'Int'   ),
        'query'                => array('allowEmpty' => true           ), 
        'container'            => array('allowEmpty' => true           ),        
    );         
}
