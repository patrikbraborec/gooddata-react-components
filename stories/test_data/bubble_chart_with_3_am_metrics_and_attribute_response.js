// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            attributeHeader: {
                                name: "Owner Name",
                                localIdentifier: "49a659fbd7c541a69284769d53a2be7f",
                                uri: "/gdc/md/" + projectId + "/obj/1028",
                                identifier: "label.owner.id.name",
                                formOf: {
                                    name: "Sales Rep",
                                    uri: "/gdc/md/" + projectId + "/obj/1025",
                                    identifier: "attr.owner.id",
                                },
                            },
                        },
                    ],
                },
                {
                    headers: [
                        {
                            measureGroupHeader: {
                                items: [
                                    {
                                        measureHeaderItem: {
                                            name: "M1",
                                            localIdentifier: "m1",
                                            uri: "/gdc/md/" + projectId + "/obj/67097",
                                            identifier: "m1",
                                        },
                                    },
                                    {
                                        measureHeaderItem: {
                                            name: "M1 + M2",
                                            localIdentifier: "am1",
                                            uri: "/gdc/md/" + projectId + "/obj/1543",
                                            identifier: "am1",
                                        },
                                    },
                                    {
                                        measureHeaderItem: {
                                            name: "M2",
                                            localIdentifier: "m2",
                                            uri: "/gdc/md/" + projectId + "/obj/13465",
                                            identifier: "m2",
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
            links: {
                executionResult:
                    "/gdc/app/projects/hzyl5wlh8rnu0ixmbzlaqpzf09ttb7c8/executionResults/8462543598567816192?q=eAGlUttOAjEQ%2FZVN18fVLZfllhif0PAiCvJENqa7O0BNb7bdIJD9d2dBjZJogiRN05nJnDNzTnfE%0AgtHW3zMJZEBmynMvoCARybUopXJkMCcSvOX5ndWlIWn0EdaVHVloK5nHzjAKQ3pFKXa6UkpmN5jE%0AYI%2BHz%2BepYsattA%2Fmw%2FHDZTPF2gF3VGA5XhZ5LIt4td2IZC1WPatKyt9kthXs1WwXtO991s17sc5e%0A4k6X9rukio7pf%2BMOA70IxgYUXsZdncHcaLU7yU%2FmC9yc%2FrX5BCTjiqtl8Fhqz85hT9otUqEDVq8P%0A8jOPzmSlh6faNtRxygS4YALmWIuCOyPY5hb9Ol3wBm32EDBjDoYCJCg%2Fm4xOdQ1BkhgO7e6GF9eI%0A%2BPk7vo%2F9tdO%2F5kxqVJRZ1ALN02h%2F0iqt3gFBsvZA%0A&c=b106b3ac0d5dfad3f599a50e077a91a9&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=0%2C0",
            },
        },
    };
};
