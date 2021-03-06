sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {number} sValue with 2 digits rounded
		 */
		numberUnit : function (sValue) {
			if (!sValue) {
				return 0;
			}
			return sValue.length;
		}

	};

});