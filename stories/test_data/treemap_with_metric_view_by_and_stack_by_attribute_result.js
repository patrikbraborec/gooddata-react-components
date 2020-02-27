// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResult: {
            data: [["58427629.5"], ["21978695.46"], ["30180730.62"], ["6038400.96"]],
            headerItems: [
                [
                    [
                        {
                            attributeHeaderItem: {
                                name: "Direct Sales",
                                uri: "/gdc/md/" + projectId + "/obj/1027/elements?id=1226",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Direct Sales",
                                uri: "/gdc/md/" + projectId + "/obj/1027/elements?id=1226",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Inside Sales",
                                uri: "/gdc/md/" + projectId + "/obj/1027/elements?id=1234",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Inside Sales",
                                uri: "/gdc/md/" + projectId + "/obj/1027/elements?id=1234",
                            },
                        },
                    ],
                    [
                        {
                            attributeHeaderItem: {
                                name: "West Coast",
                                uri: "/gdc/md/" + projectId + "/obj/1023/elements?id=1237",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "East Coast",
                                uri: "/gdc/md/" + projectId + "/obj/1023/elements?id=1225",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "West Coast",
                                uri: "/gdc/md/" + projectId + "/obj/1023/elements?id=1237",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "East Coast",
                                uri: "/gdc/md/" + projectId + "/obj/1023/elements?id=1225",
                            },
                        },
                    ],
                ],
                [
                    [
                        {
                            measureHeaderItem: {
                                name: "Amount",
                                order: 0,
                            },
                        },
                    ],
                ],
            ],
            paging: {
                count: [4, 1],
                offset: [0, 0],
                total: [4, 1],
            },
        },
    };
};
