// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            attributeHeader: {
                                name: "Region",
                                localIdentifier: "a1",
                                uri: "/gdc/md/" + projectId + "/obj/1024",
                                identifier: "label.owner.region",
                                formOf: {
                                    name: "Region",
                                    uri: "/gdc/md/" + projectId + "/obj/1023",
                                    identifier: "attr.owner.region",
                                },
                                totalItems: [{ totalHeaderItem: { name: "sum" } }],
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Department",
                                localIdentifier: "a2",
                                uri: "/gdc/md/" + projectId + "/obj/1027",
                                identifier: "label.owner.department",
                                formOf: {
                                    name: "Department",
                                    uri: "/gdc/md/" + projectId + "/obj/1026",
                                    identifier: "attr.owner.department",
                                },
                                totalItems: [{ totalHeaderItem: { name: "sum" } }],
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
                                            name: "Sum of Amount",
                                            format: "#,##0.00",
                                            localIdentifier: "7005ae7616c24689977f679a20a4a393",
                                        },
                                    },
                                    {
                                        measureHeaderItem: {
                                            name: "Sum of Probability",
                                            format: "#,##0.00",
                                            localIdentifier: "26cc9aa4d9af4fb48582d42966de5893",
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
                    "/gdc/app/projects/storybook/executionResults/3315266146082684416?c=b119d77143bb3da5def41dd3df61afb3&q=eAGtkU1LxDAQhv%2FKkl6LbbfaxQURwQ%2F2IrK6p6WHtElLNB81nVDL0v%2FuxGpxD4KUPc5k3nfeeXIg%0AljfGwiNVnKzJToMAyRkJSWmkU7ol6z1RHKwoH6xxDcnD79K%2FHEhlrKKAyiAMgvgsjlH5ZYGtZ6cW%0AplrcKOM0kCH81%2FSTNQUthBTQkwGXWdONmyhgiMIBf%2FEJ0X7La2E07mudUtT22MKCibaRtL%2FHXBuG%0ArahmZaRYRIWrG1NnwoJYXei3y%2FS9TDqWwLKT6UfVRqZ4jZJ4eY4eBW35neSKa9htNzNM0oiP8vZa%0AsKtfSKbM0zWzQqbe0gCVHs3eA8B%2F2ee5Zzw5%2F3C65Q214I9B1UlZrU7BKvuL1VHu6apZvLIjXohq%0ARJYP%2BfAJoNIAeg%3D%3D%0A&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=1%2C0",
            },
        },
    };
};
