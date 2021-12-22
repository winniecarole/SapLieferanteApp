sap.ui.define([
	"sap/ui/core/mvc/Controller",

], function ( Controller) {
	"use strict";

	return Controller.extend("com.wins.suppliers.controller.Detail", {
		_sPathProduct : "",
		onInit : function () {
			
			this.getOwnerComponent().getRouter().getRoute("detailDetail").attachPatternMatched(this._onObjectMatched, this);
            this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
//	this.getOwnerComponent().getRouter().getRoute("detailDetail").attachPatternMatched(this._onObjectMatched, this);

		},

		/*Diese Methode hängt die url an (wir werden die url weiterleiten).
		 * wir holen die supplierId aus der manifest.json und speichern sie
		 * in der Variable supplierId ;
		 * dann müssen wir den sObjectPath erstellen, der wie folgt aussieht
		 * als Suppliers(2) supplier mit der id 2 zum Beispiel konzipiert ist
		 * [metadataLoaded().then bedeutet, dass wir nicht wissen, bis wann die Daten.
		 * das Herunterladen beendet sein muss,]  /
		 */
		_onObjectMatched : function (oEvent) {
			var supplierId =  oEvent.getParameter("arguments").supplierId;
			var oFCL =	this.oView.getParent().getParent();// l objet du flexibleColumnLayout
            // route name detail
			if (oEvent.getParameter("name")==="detailDetail") {
				oFCL.setLayout("ThreeColumnsMidExpanded");
			}	
			else if(oEvent.getParameter("name")==="detail"){
				oFCL.setLayout("TwoColumnsMidExpanded");
			}

			this.getView().getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getView().getModel().createKey("Suppliers", {
					SupplierID :  supplierId
			});
				
			 // Suppliers(2)
				this._bindView("/" + sObjectPath);
			}.bind(this));
            
			
			var sProduktId = oEvent.mParameters.arguments.productId;

			this.getView().getModel().metadataLoaded().then(()=>{
				var sObjectPath2 = this.getView().getModel().createKey("Products", {
                    ProductID: sProduktId
				});
				this._sPathProduct  = "/" + sObjectPath2;
				
			})
		
		
		},


		/**
		 * hier binden wir das Objekt an die view.xml an.
		 * Bindet die View an den Objektpfad.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			//console.log(sObjectPath); /Suppliers(1)
			this.getView().bindElement({
				path: sObjectPath

			});
		},


		/**
		 * Diese Methode navigiert zu der Route mit dem Namen detailDetail.
		 * und ruft die supplierId und die productId ab, die beide denselben Namen haben müssen, weil
		 * weil sie bereits auf der Ebene des Musters (der Route) definiert wurden.
		 */
		_showDetailDetail : function (oItem) {
			this.getOwnerComponent().getRouter().navTo("detailDetail", {
				supplierId: oItem.getBindingContext().getProperty("SupplierID"),
				productId: oItem.getBindingContext().getProperty("ProductID")
			});
			oItem.setSelected(true);

		},

		/**
		 *Dies ist die Methode, die aufgerufen wird, wenn man auf ein Produkt klickt.
		 * Diese Methode ruft wiederum die showObject-Methode auf.
		 */
		onProduktPress: function (oEvent) {
			var oSource=oEvent.getSource();
			this._showDetailDetail(oSource.getSelectedItem());

		},
		handleClose: function (oEvent) {
			var oFCL = this.getView().getParent().getParent();// l objet du flexibleColumnLayout
			this.getOwnerComponent().getRouter().navTo("master");
		    oFCL.setLayout("OneColumn");
		},

		updateTableProductFinished: function (oEvent){
				
			//console.log(oEvent.getSource().getItems()[0].getBindingContextPath())
			var aProduktTable = oEvent.getSource().getItems();
			if(this._sPathProduct){
				var oItem = aProduktTable.find(item =>{
				return	this._sPathProduct === item.getBindingContextPath();
				})
				if(oItem){
					oItem.setSelected(true);
				}
			
			}

		}

	});
});
