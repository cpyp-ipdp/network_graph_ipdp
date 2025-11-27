// Load vis.js from CDN
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js";
document.head.appendChild(script);

script.onload = function () {

  looker.plugins.visualizations.add({

    id: "network_graph_ipdp",

    options: {
      nodeColor: {
        type: "string",
        label: "Node color",
        default: "#2196f3"
      },
      edgeColor: {
        type: "string",
        label: "Edge color",
        default: "#cccccc"
      }
    },

    create: function (element, config) {
      element.innerHTML = "";
      this.container = document.createElement("div");
      this.container.style.width = "100%";
      this.container.style.height = "100%";
      this.container.style.border = "1px solid #ddd";
      element.appendChild(this.container);
    },

    updateAsync: function (data, element, config, queryResponse, details, doneRendering) {

      if (!data || data.length === 0) {
        this.container.innerHTML = "<strong>No data found.</strong>";
        doneRendering();
        return;
      }

      let nodes = [];
      let edges = [];
      let nodeSet = new Set();

      data.forEach(row => {
        const source = row["dim0"] ? row["dim0"].value : null;
        const target = row["dim1"] ? row["dim1"].value : null;
        const weight = row["measure0"] ? row["measure0"].value : 1;

        if (source) nodeSet.add(source);
        if (target) nodeSet.add(target);

        edges.push({
          from: source,
          to: target,
          value: weight,
          title: `${source} → ${target} (${weight})`
        });
      });

      nodeSet.forEach(n =>
        nodes.push({ id: n, label: n })
      );

      const visNodes = new vis.DataSet(nodes);
      const visEdges = new vis.DataSet(edges);

      const options = {
        nodes: {
          shape: "dot",
          size: 6,
          color: config.nodeColor || "#2196f3",
          font: { size: 12 }
        },
        edges: {
          color: config.edgeColor || "#cccccc",
          scaling: { min: 1, max: 5 },
          smooth: true
        },
        physics: {
          barnesHut: {
            gravitationalConstant: -30000,
            springLength: 100,
            springConstant: 0.02
          },
          stabilization: { iterations: 200 }
        }
      };

      new vis.Network(this.container, { nodes: visNodes, edges: visEdges }, options);

      doneRendering();
    }
  });
};
