sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	"../model/formatter",



], function ( Controller, Filter, FilterOperator, Sorter,formatter) {
	"use strict";

	return Controller.extend("com.uniq.suppliers.controller.Master", {
		formatter: formatter,
		_sPathSupplier : "",

		onInit: function () {
			this._queryDescendingSort = false;
			this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(this._onSuppliersMatched, this);
			this.getOwnerComponent().getRouter().getRoute("detailDetail").attachPatternMatched(this._onSuppliersMatched, this);
		},
		_onSuppliersMatched: function (oEvent){		
			var supplierId =  oEvent.getParameter("arguments").supplierId;
			this.getView().getModel().metadataLoaded().then(()=>{
				var oBjectPath = this.getView().getModel().createKey("Suppliers", {
					SupplierID :  supplierId
				});
				this._sPathSupplier = "/" + oBjectPath;
			})
		},

        //search Mehode für ein bestimmte Company
		onSearch: function (oEvent) {
			var aTableSearchState = [],
				sQuery = oEvent.getParameter("query");
			if (sQuery && sQuery.length > 0) {
				//aTableSearchState = [new Filter("CompanyName", FilterOperator.Contains, sQuery)];
				aTableSearchState.push (new Filter({
					filters: [
						new Filter("CompanyName", FilterOperator.Contains, sQuery),
						new Filter("City", FilterOperator.Contains, sQuery)
					],and : false
				}))
			}
			//Wir gehenin master.view und suchen nach dem Element mit der angegebenen id (suppliersTable) und verknüpfen es mit dem Item
			this.getView().byId("suppliersTable").getBinding("items").filter(aTableSearchState, "Application");
		},

		/**
		 * Sortierung Methode entweder absteigen oer aufsteigen
		 */
		onSort: function () {
			this._queryDescendingSort = !this._queryDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("suppliersTable"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("CompanyName", this._queryDescendingSort);
			oBinding.sort(oSorter);
		},
		/*navigue vers object povient du manifest target ayant le nom object et le supplierId doit etre le
			meme que celui qui a ete dans le patternn "pattern": "Suppliers/{supplierId}", tres important
			et SupplierID est le meme qui provient du url
		*/

		/*navigiert zu einem route(mit dem Namen detail ) aus dem Manifest und verknüpft der supplierId.
		  die Variable, die für den Binden definiert ist, muss die gleiche sein wie die, die auf der Route deklariert ist
		  suppliers/{supplierId}", sehr wichtig.und SupplierID ist die gleiche, die aus der url stammt.*/
		_showDetail : function (oItem) {
			var oFCL = this.getView().getParent().getParent(); //  flexibleColumnLayout objekt
		    oFCL.setLayout("OneColumn");
			this.getOwnerComponent().getRouter().navTo("detail", {
				supplierId: oItem.getBindingContext().getProperty("SupplierID")
			});
			oItem.setSelected(true);
		},


		/**
		 * Diese Methode wird aufgerufen, wenn wir auf ein Lieferant klicken,
		 * und wird showDetail wiederruffen, die zu der detail route navigiert
		 */
		onListItemPress: function (oEvent) {
			var oSource = oEvent.getSource();
			this._showDetail(oSource.getSelectedItem());

		},
		updateTableFinished: function (oEvent){	
			var aTableItems = oEvent.getSource().getItems();
			if(this._sPathSupplier){	
				var oItem = aTableItems.find(item =>
                     this._sPathSupplier === item.getBindingContextPath()
				)
				if (oItem){
					oItem.setSelected(true);
				}
			}
		}
	});
});
