// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "aaEGaXAEgB7U",
                        definition: {
                            measure: {
                                item: {
                                    identifier: "aaEGaXAEgB7U",
                                },
                            },
                        },
                    },
                    {
                        localIdentifier: "aabHeqImaK0d",
                        definition: {
                            measure: {
                                item: {
                                    identifier: "aabHeqImaK0d",
                                },
                            },
                        },
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            identifier: "label.restaurantlocation.locationstate",
                        },
                        localIdentifier: "label.restaurantlocation.locationstate",
                    },
                    {
                        displayForm: {
                            identifier: "label.restaurantlocation.locationname",
                        },
                        localIdentifier: "label.restaurantlocation.locationname",
                    },
                    {
                        displayForm: {
                            identifier: "label.menuitem.menucategory",
                        },
                        localIdentifier: "label.menuitem.menucategory",
                    },
                    {
                        displayForm: {
                            identifier: "date.aam81lMifn6q",
                        },
                        localIdentifier: "date.aam81lMifn6q",
                    },
                    {
                        displayForm: {
                            identifier: "date.abm81lMifn6q",
                        },
                        localIdentifier: "date.abm81lMifn6q",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: [
                            "label.restaurantlocation.locationstate",
                            "label.restaurantlocation.locationname",
                            "label.menuitem.menucategory",
                        ],
                        totals: [
                            {
                                measureIdentifier: "aaEGaXAEgB7U",
                                type: "sum",
                                attributeIdentifier: "label.restaurantlocation.locationstate",
                            },
                            {
                                measureIdentifier: "aabHeqImaK0d",
                                type: "sum",
                                attributeIdentifier: "label.restaurantlocation.locationstate",
                            },
                            {
                                measureIdentifier: "aaEGaXAEgB7U",
                                type: "avg",
                                attributeIdentifier: "label.restaurantlocation.locationstate",
                            },
                        ],
                    },
                    {
                        itemIdentifiers: ["date.aam81lMifn6q", "date.abm81lMifn6q", "measureGroup"],
                    },
                ],
            },
        },
    };
};
