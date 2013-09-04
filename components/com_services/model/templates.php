<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_services
 *
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Template style model.
 *
 * @package     Joomla.Site
 * @subpackage  com_services
 * @since       3.2
 */
class ServicesModelTemplates extends JModelCmsform
{

	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @since   3.2
	 */
	protected function populateState()
	{

		$state = $this->loadState();

		// Load the parameters.
		$params	= JComponentHelper::getParams('com_templates');
		$state->set('params', $params);

		$this->setState($state);
	}

	/**
	 * Method to get the record form.
	 *
	 * @param   array    $data      An optional array of data for the form to interogate.
	 * @param   boolean  $loadData  True if the form is to load its own data (default case), false if not.
	 *
	 * @return  JForm	A JForm object on success, false on failure
	 *
	 * @since   3.2
	 */
	public function getForm($data = array(), $loadData = true)
	{
		// Get the form.
				$form = $this->loadForm('com_services.templates', 'templates', array('control' => 'jform', 'load_data' => $loadData));
/*
		try
		{
			$form = new JForm('com_services.templates');
			$data = array();
			$this->preprocessForm($form, $data);

			// Load the data into the form
			$form->bind($data);
		}
		catch (Exception $e)
		{
			
			$app = JFactory::getApplication();
			$app->enqueueMessage($e->getMessage());

			return false;
		}
*/

		if (empty($form))
		{
			return false;
		}

		return $form;
	}

	/**
	 * @param   object  $form  A form object.
	 * @param   mixed   $data  The data expected for the form.
	 *
	 * @throws	Exception if there is an error in the form event.
	 * @since   3.2
	 */
	protected function preprocessForm(JForm $form, $data, $group = 'content')
	{

		$lang = JFactory::getLanguage();
		$app = JFactory::getApplication();

		$template = $app->getTemplate();

		jimport('joomla.filesystem.path');

		// Load the core and/or local language file(s).
		$lang->load('tpl_' . $template, JPATH_BASE, null, false, false)
		||	$lang->load('tpl_' . $template, JPATH_BASE . '/templates/' . $template, null, false, false)
		||	$lang->load('tpl_' . $template, JPATH_BASE, $lang->getDefault(), false, false)
		||	$lang->load('tpl_' . $template, JPATH_BASE . '/templates/' . $template, $lang->getDefault(), false, false);

		// Look for com_services.xml, which contains fileds to display
		$formFile	= JPath::clean(JPATH_BASE . '/templates/' . $template . '/com_services.xml');

		if (!file_exists($formFile))
		{
			// If com_services.xml not found, fall back to templateDetails.xml
			$formFile	= JPath::clean(JPATH_BASE . '/templates/' . $template . '/templateDetails.xml');
		}

		if (file_exists($formFile))
		{
			// Get the template form.
			if (!$form->loadFile($formFile, false, '//config'))
			{
				throw new Exception(JText::_('JERROR_LOADFILE_FAILED'));
			}
		}

		// Attempt to load the xml file.
		if (!$xml = simplexml_load_file($formFile))
		{
			throw new Exception(JText::_('JERROR_LOADFILE_FAILED'));
		}

		// Trigger the default form events.
		parent::preprocessForm($form, $data, $group);
	}

}
