// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        buckets: [
            {
                localIdentifier: "measures",
                items: [
                    {
                        measure: {
                            localIdentifier: "c56920dac98641ccb703f53b9eb977b6",
                            title: "_Close [EOP]",
                            definition: {
                                measureDefinition: {
                                    item: {
                                        uri: "/gdc/md/" + projectId + "/obj/9203",
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            {
                localIdentifier: "secondary_measures",
                items: [
                    {
                        measure: {
                            localIdentifier: "5a9402a04445430880fd1c8b6d846164",
                            title: "# of Activities",
                            definition: {
                                measureDefinition: {
                                    item: {
                                        uri: "/gdc/md/" + projectId + "/obj/14636",
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            {
                localIdentifier: "attribute",
                items: [
                    {
                        visualizationAttribute: {
                            localIdentifier: "ed40da1056ae45e39a402941a1e4ff1b",
                            displayForm: {
                                uri: "/gdc/md/" + projectId + "/obj/970",
                            },
                        },
                    },
                ],
            },
        ],
    };
};
