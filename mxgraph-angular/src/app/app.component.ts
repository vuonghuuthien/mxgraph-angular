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
  @ViewChild('sidebarContainer') sidebarContainer: ElementRef;
  @ViewChild('graphContainer') graphContainer: ElementRef;
  ngAfterViewInit() {
    const graph = new mxGraph(this.graphContainer.nativeElement);
    const sidebar = document.getElementById('sidebarContainer');
    graph.setAllowDanglingEdges(false); // Does not allow dangling edges
    graph.isHtmlLabel = function(cell) {
      return !this.isSwimlane(cell);
    }
    graph.setConnectable(true);
    this.configureStylesheet(graph);

    this.addSidebarIcon(graph, sidebar, 
      '<img src="/assets/image/icon_1.png" height="38" style="object-fit: cover;">',
      '/assets/image/icon_1.png')
    this.addSidebarIcon(graph, sidebar, 
      '<img src="/assets/image/icon_2.png" height="38" style="object-fit: cover;">',
      '/assets/image/icon_2.png')
    this.addSidebarIcon(graph, sidebar, 
      '<img src="/assets/image/icon_3.png" height="38" style="object-fit: cover;">',
      '/assets/image/icon_3.png')
    
    this.main(document.getElementById('graphContainer'),
			document.getElementById('outlineContainer'),
		 	document.getElementById('toolbarContainer'),
			document.getElementById('sidebarContainer'))
  }

  main(container, outline, toolbar, sidebar) {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error('Browser is not supported!', 200, false);
    } else {
      mxConstants.MIN_HOTSPOT_SIZE = 16;
      mxConstants.DEFAULT_HOTSPOT = 1;

      mxGraphHandler.prototype.guidesEnabled = true; // Cho phép hướng dẫn

      mxGuide.prototype.isEnabledForEvent = function(evt) // Alt vô hiệu hóa hướng dẫn
      {
        return !mxEvent.isAltDown(evt);
      };

      mxEdgeHandler.prototype.snapToTerminals = true; // Cho phép chụp điểm tham chiếu đến thiết bị đầu cuối

      if (mxClient.IS_QUIRKS) {
        document.body.style.overflow = 'hidden';
        new mxDivResizer(container);
        new mxDivResizer(outline);
        new mxDivResizer(toolbar);
        new mxDivResizer(sidebar);
      }
      //
      var editor = new mxEditor();
      var graph = editor.graph;
      var model = graph.getModel();

      graph.setDropEnabled(false); // Vô hiệu hóa tô sáng các ô khi kéo từ thanh công cụ

      graph.connectionHandler.getConnectImage = function(state) // Sử dụng biểu tượng cổng trong khi kết nối được xem trước
      {
        return new mxImage(state.style[mxConstants.STYLE_IMAGE], 16, 16);
      };

      graph.connectionHandler.targetConnectImage = true; // Trung tâm biểu tượng cổng trên cổng đích
      
      graph.setAllowDanglingEdges(false); // Does not allow dangling edges

      // Đặt bộ chứa biểu đồ và định cấu hình trình chỉnh sửa
      editor.setGraphContainer(container);
      var config = mxUtils.load(
        '/assets/xml/keyhandler-commons.xml').
          getDocumentElement();
      editor.configure(config);

      var group = new mxCell('Group', new mxGeometry(), 'group');
      group.setVertex(true);
      group.setConnectable(false);
      editor.defaultGroup = group;
      editor.groupBorderSize = 20;

      // Disables drag-and-drop into non-swimlanes.
      graph.isValidDropTarget = function(cell, cells, evt) {
        return this.isSwimlane(cell);
      };

      // Disables drilling into non-swimlanes.
      graph.isValidRoot = function(cell) {
        return this.isValidDropTarget(cell);
      }

      // Trả về nhãn ngắn hơn nếu ô bị thu gọn và không có nhãn cho các nhóm mở rộng
      graph.getLabel = function(cell) {
        var tmp = mxGraph.prototype.getLabel.apply(this, arguments); // "supercall"
        
        if (this.isCellLocked(cell)) {
          return '';
        } else if (this.isCellCollapsed(cell)) {
          var index = tmp.indexOf('</h1>');
          
          if (index > 0) {
            tmp = tmp.substring(0, index+5);
          }
        }
        return tmp;
      }

      graph.isHtmlLabel = function(cell) {
        return !this.isSwimlane(cell);
      }

      // Enables new connections
			graph.setConnectable(true);
    }
  }

  addSidebarIcon(graph, sidebar, html, image) {
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
