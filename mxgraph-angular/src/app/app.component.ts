import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

declare var mxGeometry: any;
declare var mxUtils: any;
declare var mxDivResizer: any;
declare var mxClient: any;
declare var mxConstants: any;
declare var mxEditor: any;
declare var mxCell: any;
declare var mxEdgeHandler: any;
declare var mxGuide: any;
declare var mxGraphHandler: any;
declare var mxCodec: any;
declare var mxEvent: any;
declare var mxOutline: any;
declare var mxEdgeStyle: any;
declare var mxCellOverlay: any;
declare var mxImage: any;
declare var mxPerimeter: any;
declare var mxConnectionHandler: any;
declare var mxEffects: any;
declare var mxRectangle: any;
declare var mxWindow: any;
declare var mxConnectionConstraint: any;
declare var mxPoint: any;
declare var mxGraph: any;
declare var mxParallelEdgeLayout: any;
declare var mxLayoutManager: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('toolbarContainer') toolbarContainer: ElementRef;
  @ViewChild('sidebarContainer') sidebarContainer: ElementRef;
  @ViewChild('graphContainer') graphContainer: ElementRef;
  @ViewChild('outlineContainer') outlineContainer: ElementRef;
  ngAfterViewInit() {
    var editor = new mxEditor();
    var graph = editor.graph;
    // const graph = new mxGraph(this.graphContainer.nativeElement);
    const container = document.getElementById('graphContainer');
    const toolbar = document.getElementById('toolbarContainer');
    const sidebar_sequences = document.getElementById('sequences'); // sidebarContainer
    const sidebar_goals = document.getElementById('goals');         // sidebarContainer
    const outline = document.getElementById('outlineContainer');
    // Defines an icon for creating new connections in the connection handler.
		// This will automatically disable the highlighting of the source vertex.
    mxConnectionHandler.prototype.connectImage = new mxImage('/assets/image/connector.gif', 16, 16);
    this.createCells(graph, sidebar_sequences, sidebar_goals);
    this.createToolbar(editor, toolbar, container);
    this.showOutline(graph, outline);
  }

  createCells(graph, sidebar_sequences, sidebar_goals) {
    graph.setAllowDanglingEdges(false); // Does not allow dangling edges
    graph.isHtmlLabel = function(cell) { // For label is Html
      return !this.isSwimlane(cell);
    }

    graph.dblClick = function(evt, cell)
    {
      // Disables any default behaviour for the double click
      mxEvent.consume(evt);
    };
    graph.setConnectable(true);
    this.configureStylesheet(graph);

    this.addSidebarIcon(graph, sidebar_sequences, 
      '<div style="position: relative;">' + 
        '<img src="/assets/image/icon_1.png" height="38" style="object-fit: cover;">' + 
        '<div class="d-flex justify-content-center"><b class="position-absolute mt-1">Sequence</b></div>' + 
      '</div>',
      '/assets/image/icon_1.png', 'sequence')
    this.addSidebarIcon(graph, sidebar_goals, 
      '<div style="position: relative;">' + 
        '<img src="/assets/image/icon_2.png" height="38" style="object-fit: cover;">' + 
        '<div class="d-flex justify-content-center"><b class="position-absolute mt-1">Name Goal</b></div>' + 
      '</div>',
      '/assets/image/icon_2.png', 'goal')
    this.addSidebarIcon(graph, sidebar_goals, 
      '<div style="position: relative;">' + 
        '<img src="/assets/image/icon_3.png" height="38" style="object-fit: cover;">' + 
        '<div class="d-flex justify-content-center"><b class="position-absolute mt-1">Name Goal</b></div>' + 
      '</div>',
      '/assets/image/icon_3.png', 'goal')
  }

  addToolbarButton(editor, toolbar, action, label, image, isTransparent?)
  {
    var button = document.createElement('button');
    button.style.fontSize = '10px';
    if (image != null)
    {
      var img = document.createElement('img');
      img.setAttribute('src', image);
      img.style.width = '16px';
      img.style.height = '16px';
      img.style.verticalAlign = 'middle';
      img.style.marginRight = '2px';
      button.appendChild(img);
    }
    if (isTransparent)
    {
      button.style.background = 'transparent';
      button.style.color = '#FFFFFF';
      button.style.border = 'none';
    }
    mxEvent.addListener(button, 'click', function(evt)
    {
      console.log(action);
      editor.execute(action);
    });
    mxUtils.write(button, label);
    toolbar.appendChild(button);
  }

  createToolbar(editor, toolbar, container) {
    // Sets the graph container and configures the editor
    editor.setGraphContainer(container);
    var config = mxUtils.load(
      '/assets/xml/keyhandler-commons.xml').
        getDocumentElement();
    editor.configure(config);
    // Creates a new DIV that is used as a toolbar and adds
    // toolbar buttons.
    var spacer = document.createElement('div');
    spacer.style.display = 'inline';
    spacer.style.padding = '8px';

    this.addToolbarButton(editor, toolbar, 'delete', 'Delete', '/assets/image/delete2.png');
				
    toolbar.appendChild(spacer.cloneNode(true));
    
    this.addToolbarButton(editor, toolbar, 'cut', 'Cut', '/assets/image/cut.png');
    this.addToolbarButton(editor, toolbar, 'copy', 'Copy', '/assets/image/copy.png');
    this.addToolbarButton(editor, toolbar, 'paste', 'Paste', '/assets/image/paste.png');

    toolbar.appendChild(spacer.cloneNode(true));

    this.addToolbarButton(editor, toolbar, 'undo', '', '/assets/image/undo.png');
    this.addToolbarButton(editor, toolbar, 'redo', '', '/assets/image/redo.png');

    toolbar.appendChild(spacer.cloneNode(true));
  }

  addSidebarIcon(graph, sidebar, html, image, typeShape?) {

    var funct = function(graph, evt, cell, x, y)
    {
      var parent = graph.getDefaultParent();
      var model = graph.getModel();
      
      var vertex = null;
      
      model.beginUpdate();
      try
      {
        // Adds the vertex 
        if (typeShape == "sequence") {
          vertex = graph.insertVertex(parent, null, html, x, y, 120, 40, typeShape);
        } else if (typeShape == "goal") {
          vertex = graph.insertVertex(parent, null, html, x, y, 40, 40, typeShape);
        }
        vertex.setConnectable(false);
                  
        // Adds the ports at various relative locations
        var port = graph.insertVertex(vertex, null, 'in', 0, 0.5, 16, 16,
            'port;image=/assets/image/before.png;align=right;imageAlign=right;spacingRight=18', true);
        port.geometry.offset = new mxPoint(-8, -8);

        var port = graph.insertVertex(vertex, null, 'out', 1, 0.5, 16, 16,
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
    img.style.marginRight = '5px';
    img.title = 'Drag this to the diagram to create a new vertex';
    sidebar.appendChild(img);
    
    var dragElt = document.createElement('div');
    dragElt.style.border = 'dashed black 1px';
    if (typeShape == "sequence") {
      dragElt.style.width = '120px';
      dragElt.style.height = '40px';
    } else if (typeShape == "goal") {
      dragElt.style.width = '40px';
      dragElt.style.height = '40px';
    }
                
    // Creates the image which is used as the drag icon (preview)
    var ds = mxUtils.makeDraggable(img, graph, funct, dragElt, 0, 0, true, true);
    ds.setGuidesEnabled(true);
  }

  showOutline(graph, outline) {
    // Creates the outline (navigator, overview) for moving around the graph in the top, right corner of the window.
    var outln = new mxOutline(graph, outline);

    // Show the images in the outline
    outln.outline.labelsVisible = true;
    outln.outline.setHtmlLabels(true);
  }

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
    // style[mxConstants.STYLE_IMAGE_WIDTH] = '20';
    // style[mxConstants.STYLE_IMAGE_HEIGHT] = '20';
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
  }

  hoverIcons() {

  }
}
