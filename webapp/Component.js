sap.ui.define([
	'sap/ui/core/UIComponent',
], function(UIComponent) {
	'use strict';

	return UIComponent.extend('com.wins.suppliers.Component', {

		metadata: {
			manifest: 'json'
		},

		init: function () {

			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();
		}
	});
});
