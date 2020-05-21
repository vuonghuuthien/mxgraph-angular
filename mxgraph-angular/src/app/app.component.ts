import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

declare var mxGraph: any;
declare var mxHierarchicalLayout: any;
declare var mxDivResizer: any;
declare var mxPerimeter: any;
declare var mxConstants: any;
declare var mxRectangle: any;
declare var mxEdgeStyle: any;
declare var mxEffects: any;
declare var mxWindow: any;
declare var mxClient: any;
declare var mxEvent: any;
declare var mxPoint: any;
declare var mxUtils: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('sidebarContainer') sidebarContainer: ElementRef;
  @ViewChild('graphContainer') graphContainer: ElementRef;
  ngAfterViewInit() {
    // Creates the graph inside the DOM node.
    const graph = new mxGraph(this.graphContainer.nativeElement);
    const sidebar = document.getElementById('sidebarContainer');
    // Enables new connections
    graph.setConnectable(true);
    // Adds all required styles to the graph (see below)
    this.configureStylesheet(graph);

    this.addSidebarIcon(graph, sidebar, 
      '<img src="/assets/image/icon.png" width="48" height="48">',
      '/assets/image/icon.png')
  }

  addSidebarIcon(graph, sidebar, html, image)
  {
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    var funct = function(graph, evt, cell, x, y)
    {
      var parent = graph.getDefaultParent();
      var model = graph.getModel();
      
      var vertex = null;
      
      model.beginUpdate();
      try
      {
        // NOTE: For non-HTML labels the image must be displayed via the style
        // rather than the label markup, so use 'image=' + image for the style.
        // as follows: v1 = graph.insertVertex(parent, null, label,
        // pt.x, pt.y, 120, 120, 'image=' + image);
        vertex = graph.insertVertex(parent, null, html, x, y, 120, 40);
        vertex.setConnectable(false);
                  
        // Adds the ports at various relative locations
        var port = graph.insertVertex(vertex, null, '', 0, 0.5, 16, 16,
            'port;image=/assets/image/before.png;align=right;imageAlign=right;spacingRight=18', true);
        port.geometry.offset = new mxPoint(-8, -8);

        var port = graph.insertVertex(vertex, null, '', 1, 0.5, 16, 16,
            'port;image=/assets/image/after.png;spacingLeft=18', true);
        port.geometry.offset = new mxPoint(-8, -8);
      }
      finally
      {
        model.endUpdate();
      }
      
      graph.setSelectionCell(vertex);
    }
    
    // Creates the image which is used as the sidebar icon (drag source)
    var img = document.createElement('img');
    img.setAttribute('src', image);
    img.style.width = '35px';
    img.style.height = '35px';
    img.title = 'Drag this to the diagram to create a new vertex';
    sidebar.appendChild(img);
    
    var dragElt = document.createElement('div');
    dragElt.style.border = 'dashed black 1px';
    dragElt.style.width = '120px';
    dragElt.style.height = '40px';
                
    // Creates the image which is used as the drag icon (preview)
    var ds = mxUtils.makeDraggable(img, graph, funct, dragElt, 0, 0, true, true);
    ds.setGuidesEnabled(true);
  };

  configureStylesheet(graph)
  {
    // set default styles for graph
    var style = new Object();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    // style[mxConstants.STYLE_GRADIENTCOLOR] = '#E0E0E0';
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#9E9E9E';
    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    style[mxConstants.STYLE_ROUNDED] = true;
    // style[mxConstants.STYLE_SHADOW] = true;
    style[mxConstants.STYLE_IMAGE_WIDTH] = '20';
    style[mxConstants.STYLE_IMAGE_HEIGHT] = '20';
    graph.getStylesheet().putDefaultVertexStyle(style);

    style = new Object();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    style[mxConstants.STYLE_FILLCOLOR] = '#FF9103';
    style[mxConstants.STYLE_GRADIENTCOLOR] = '#F8C48B';
    style[mxConstants.STYLE_STROKECOLOR] = '#E86A00';
    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_OPACITY] = '80';
    style[mxConstants.STYLE_STARTSIZE] = '30';
    style[mxConstants.STYLE_FONTSIZE] = '16';
    style[mxConstants.STYLE_FONTSTYLE] = 1;
    graph.getStylesheet().putCellStyle('group', style);
    
    style = new Object();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
    style[mxConstants.STYLE_FONTCOLOR] = '#774400';
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_PERIMETER_SPACING] = '6';
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_FONTSIZE] = '10';
    style[mxConstants.STYLE_FONTSTYLE] = 2;
    style[mxConstants.STYLE_IMAGE_WIDTH] = '16';
    style[mxConstants.STYLE_IMAGE_HEIGHT] = '16';
    graph.getStylesheet().putCellStyle('port', style);
    
    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKEWIDTH] = '2';
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
  };
}
