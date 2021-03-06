// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "m1",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/2352",
                                },
                            },
                        },
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/2188",
                        },
                        localIdentifier: "a1",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/2197",
                        },
                        localIdentifier: "a2",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/2211",
                        },
                        localIdentifier: "a3",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/2005",
                        },
                        localIdentifier: "a4",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/2205",
                        },
                        localIdentifier: "a5",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["a1", "a2", "a3", "a4", "a5"],
                        totals: [
                            {
                                measureIdentifier: "m1",
                                type: "min",
                                attributeIdentifier: "a1",
                            },
                            {
                                measureIdentifier: "m1",
                                type: "sum",
                                attributeIdentifier: "a2",
                            },
                            {
                                measureIdentifier: "m1",
                                type: "max",
                                attributeIdentifier: "a2",
                            },
                            {
                                measureIdentifier: "m1",
                                type: "sum",
                                attributeIdentifier: "a3",
                            },
                            {
                                measureIdentifier: "m1",
                                type: "max",
                                attributeIdentifier: "a3",
                            },
                            {
                                measureIdentifier: "m1",
                                type: "avg",
                                attributeIdentifier: "a5",
                            },
                        ],
                    },
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                ],
            },
        },
    };
};
