import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';
import { SankeyData, SankeyNode, SankeyLink } from '../types';

interface SankeyDiagramProps {
  data: SankeyData;
  width?: number;
  height?: number;
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ data, width = 800, height = 400 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Helper formatting function
  const formatValue = (val: number) => {
    if (val >= 100000000) {
      return `${(val / 100000000).toFixed(2)} 亿元`;
    } else if (val >= 10000000) {
      return `${(val / 10000000).toFixed(2)} 千万元`;
    }
    return `${(val / 1000000).toFixed(2)} 百万元`;
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const margin = { top: 20, right: 140, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(15)
      .nodePadding(12)
      .extent([[0, 0], [innerWidth, innerHeight]])
      .nodeAlign(sankeyLeft);

    // Deep copy data to avoid mutation issues in strict mode
    const graph = sankeyGenerator({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d }))
    });

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Helper to determine node colors
    const getNodeColor = (name: string) => {
        // --- Common ---
        if (name.includes("净现金")) return "#10b981"; // Green (Net retention)
        if (name.includes("缺口") || name.includes("需自有")) return "#fca5a5";   // Light Red (Gap filler)
        
        // --- Operating ---
        if (name === "经营现金总流入") return "#3b82f6"; // Blue Main
        if (name.includes("原材料")) return "#ef4444"; 
        if (name.includes("能源")) return "#f87171";
        if (name.includes("薪酬")) {
            if (name.includes("研发")) return "#a855f7"; // Purple for R&D
            if (name.includes("生产")) return "#f59e0b"; // Amber for Production
            if (name.includes("销售")) return "#14b8a6"; // Teal for Sales
            if (name.includes("管理")) return "#fbbf24"; // Light amber for Mgmt
            return "#fbbf24"; 
        }
        if (name.includes("税费")) return "#94a3b8"; 
        if (name.includes("BU")) return "#60a5fa"; 

        // --- Investing ---
        if (name === "投资现金总流入") return "#8b5cf6"; // Purple Main
        if (name.includes("投资收益")) return "#a78bfa";
        if (name.includes("处置资产")) return "#c4b5fd";
        if (name.includes("购建资产") || name.includes("CAPEX")) return "#db2777"; // Pinkish Red for CAPEX outflow
        if (name.includes("购买理财") || name.includes("理财赎回")) return "#f472b6"; // Pink for Wealth Mgmt (Rollover)

        // --- Financing ---
        if (name === "筹资现金总流入") return "#059669"; // Emerald Main
        if (name.includes("借款")) return "#34d399";
        if (name.includes("信用证")) return "#6ee7b7";
        if (name.includes("偿还债务")) return "#ea580c"; // Orange for Debt Repayment
        if (name.includes("股利") || name.includes("利息")) return "#f97316";
        if (name.includes("回购")) return "#ef4444"; // Red for Buyback
        if (name.includes("租赁")) return "#fdba74";

        
        return "#cbd5e1"; // Gray default
    };

    // Draw Links
    const link = g.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.35)
      .selectAll("g")
      .data(graph.links)
      .join("g")
      .style("mix-blend-mode", "multiply");

    const gradient = link.append("linearGradient")
        .attr("id", (d, i) => `link-gradient-${i}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => (d.source as any).x1)
        .attr("x2", d => (d.target as any).x0);

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => getNodeColor((d.source as any).name));

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", (d: any) => getNodeColor((d.target as any).name));

    link.append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d, i) => `url(#link-gradient-${i})`)
      .attr("stroke-width", d => Math.max(1, d.width!));

    link.append("title")
      .text(d => `${(d.source as any).name} → ${(d.target as any).name}\n${formatValue(d.value)}`);

    // Draw Nodes
    const node = g.append("g")
      .selectAll("rect")
      .data(graph.nodes)
      .join("rect")
      .attr("x", d => d.x0!)
      .attr("y", d => d.y0!)
      .attr("height", d => d.y1! - d.y0!)
      .attr("width", d => d.x1! - d.x0!)
      .attr("fill", d => getNodeColor(d.name))
      .attr("stroke", "#fff")
      .attr("rx", 2);

    node.append("title")
      .text(d => `${d.name}\n${formatValue(d.value!)}`);

    // Add Labels
    g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 11)
      .selectAll("text")
      .data(graph.nodes)
      .join("text")
      .attr("x", d => d.x0! < innerWidth / 2 ? d.x1! + 6 : d.x0! - 6)
      .attr("y", d => (d.y1! + d.y0!) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0! < innerWidth / 2 ? "start" : "end")
      .text(d => d.name)
      .append("tspan")
      .attr("fill-opacity", 0.6)
      .attr("x", d => d.x0! < innerWidth / 2 ? d.x1! + 6 : d.x0! - 6)
      .attr("dy", "1.1em")
      .attr("font-size", 10)
      .text(d => {
         // Condensed format for label
         if (d.value! >= 100000000) return `${(d.value! / 100000000).toFixed(2)}亿`;
         if (d.value! >= 10000000) return `${(d.value! / 10000000).toFixed(2)}千万`;
         return `${(d.value! / 1000000).toFixed(1)}百万`;
      });

  }, [data, width, height]);

  return (
    <div className="w-full overflow-x-auto flex justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <svg ref={svgRef} width={width} height={height} className="min-w-[800px]"></svg>
    </div>
  );
};

export default SankeyDiagram;