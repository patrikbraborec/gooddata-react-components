// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "784a5018a51049078e8f7e86247e08a3",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/67097",
                                },
                            },
                        },
                        alias: "_Snapshot [EOP-2]",
                    },
                    {
                        localIdentifier: "9e5c3cd9a93f4476a93d3494cedc6010",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/13465",
                                },
                            },
                        },
                        alias: "# of Open Opps.",
                    },
                    {
                        localIdentifier: "71d50cf1d13746099b7f506576d78e4a",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1543",
                                },
                            },
                        },
                        alias: "Remaining Quota",
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/1028",
                        },
                        localIdentifier: "49a659fbd7c541a69284769d53a2be7f",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["49a659fbd7c541a69284769d53a2be7f"],
                    },
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                ],
                sorts: [],
            },
        },
    };
};
