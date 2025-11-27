// Cargar vis.js desde CDN
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js";
document.head.appendChild(script);

script.onload = () => {
    looker.plugins.visualizations.add({
        id: "network_graph_ipdp",
        label: "Network Graph IPDP",
        create: function (element, config) {
            element.innerHTML = `
                <div id="network" style="width:100%; height:600px;"></div>
            `;
        },
        update: function (data, element, config, queryResponse) {

            // Crear nodos y enlaces a partir de la tabla de Looker Studio
            let nodes = [];
            let edges = [];

            data.forEach(row => {
                const source = row["source"]?.value;
                const target = row["target"]?.value;
                const weight = row["weight"]?.value || 1;

                if (!nodes.find(n => n.id === source))
                    nodes.push({ id: source, label: source });

                if (!nodes.find(n => n.id === target))
                    nodes.push({ id: target, label: target });

                edges.push({ from: source, to: target, value: weight });
            });

            let networkData = {
                nodes: new vis.DataSet(nodes),
                edges: new vis.DataSet(edges)
            };

            let options = {
                edges: { smooth: true },
                physics: {
                    enabled: true,
                    stabilization: false
                }
            };

            let container = document.getElementById('network');
            new vis.Network(container, networkData, options);
        }
    });
};
