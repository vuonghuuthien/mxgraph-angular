import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

declare var mxGraph: any;
declare var mxHierarchicalLayout: any;
declare var mxPerimeter: any;
declare var mxConstants: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainer: ElementRef;
  ngAfterViewInit() {
    // Creates the graph inside the DOM node.
    const graph = new mxGraph(this.graphContainer.nativeElement);
    // Disables basic selection and cell handling
    //graph.setCellsEditable(false);
    // set default styles for graph
    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = 'box';

    // Adds a gradient and shadow to improve the user experience
    style[mxConstants.STYLE_GRADIENTCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_SHADOW] = true;
    try {
      const parent = graph.getDefaultParent();
      graph.getModel().beginUpdate();
      const vertex1 = graph.insertVertex(parent, '1', 'Vertex 1', 0, 0, 200, 80);
      const vertex2 = graph.insertVertex(parent, '2', 'Vertex 2', 0, 0, 200, 80);
      graph.insertEdge(parent, '', '', vertex1, vertex2);
    } finally {
      graph.getModel().endUpdate();
      new mxHierarchicalLayout(graph).execute(graph.getDefaultParent());
    }
  }
}
