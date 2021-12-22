sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function ( Controller) {
	"use strict";

	return Controller.extend("com.wins.suppliers.controller.DetailDetail", {
		onInit : function () {
			this.oView = this.getView();
			this.getOwnerComponent().getRouter().getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);
		},
        /*
		Diese Methode hängt die url
		 * wir rufen die supplierId aus der manifest.json ab und speichern sie dann
		 * in der Variable supplierId ;
		 * metadataLoaded().then bedeutet, dass wir nicht wissen, wie lange die Daten noch brauchen.
		 * das Herunterladen beendet sein muss, dann müssen wir den sObjectPath erstellen, der wie folgt aussieht
		 * als Suppliers(2) supplier mit der id 2 zum Beispiel konzipiert ist.
		*/
		_onProductMatched: function (oEvent) {
			var oFCL = this.oView.getParent().getParent();// l objet du flexibleColumnLayout
		    oFCL.setLayout("ThreeColumnsMidExpanded");
            var sProduktId = oEvent.getParameter("arguments").productId;
			this.getView().getModel().metadataLoaded().then( function() {
                //"Suppliers/{supplierId}/detailDetail/{productId}",
                //gebinden wird gegen Products(6)
                var sObjectPath = this.getView().getModel().createKey("/Products", {
                    ProductID: sProduktId
				});
				this._bindView(sObjectPath);
			}.bind(this));
		},

		/**
         * hier binden wir das Objekt an die view.xml an.
		 * Bindet die View an den Objektpfad.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			this.getView().bindElement({
				path: sObjectPath

			});
		},


		handleClose: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("detail",{
				supplierId: oEvent.getSource().getBindingContext().getProperty("SupplierID")
			});
		}

	});
});
