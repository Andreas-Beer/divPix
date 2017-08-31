/*globals document, Image*/
(function () {

  /* Test */

  var img =
//    'images/rgbs_test.png';
//    'images/rgba_test.png';
//    'images/bucket_small.jpg';
//    'images/bucket.jpg';
//    'images/PICKUP.png';
//    'images/8bit-car_test.png';
//    'images/zelda_test.png';
    'images/zelda_part1_test.png';
//    'images/zelda_part1a_test.png';
//    'images/btnSet.png';
//    'images/Ellipse.jpg';
//
  analyseImage(img,divImage);

  /* Test */

  function divImage (analysedImage) {
    
    console.log(analysedImage);
    
    var MULTI_SCALE = 10;
    
    var parsedColors = analysedImage.colors;
    var image = analysedImage.image;

    var head = document.getElementsByTagName('head')[0];
    var pic  = document.getElementById('pic');

    var uniquClasses = parseUniqeClasses(parsedColors.unique);
    var divPixels    = createDivPixels(parsedColors.all, uniquClasses[0]);

    // create the header
    var style = document.createElement('style');
    style.innerHTML = uniquClasses[1].join('');
    head.appendChild(style);

    // append the pic 
    pic.appendChild(divPixels);
    pic.setAttribute(
      'style',
      'width:' + image.width * MULTI_SCALE + 'px; ' + 
      'height:' + image.height * MULTI_SCALE + 'px;'
    );

    function parseUniqeClasses (parsedColors) {
      
      var uniquClasses = {};
      var styles = [];

      for (var i = 0; i < parsedColors.length; i++) {

        var currColor = parsedColors[i];
        
          var id = i;
          var color = currColor;
          var cssClass = 'color_' + i;
          var cssStyle = '.' + cssClass + '{ background-color:' + currColor + ' }\n';

          styles.push(cssStyle);

          uniquClasses[currColor] = {
            id: id,
            color: color,
            cssStyle: cssStyle,
            cssClass: cssClass
          };
      }

      return [uniquClasses, styles];
    }

    function createDivPixels (parsedColors, uniqueClasses) {

      var pixels = document.createElement('div');

      var pix = parsedColors.map(function (currColor) {

        var currClass = uniqueClasses[currColor].cssClass;
        var pixel = document.createElement('div');
        pixel.setAttribute('class', 'pix ' + currClass);
        pixel.setAttribute(
          'style',
          'width: ' + MULTI_SCALE + 'px; ' +
          'height: ' + MULTI_SCALE + 'px; '+
          'float: left;'
        );

        return pixel;

      });

      for (var i = 0; i < pix.length; i++) {
        pixels.appendChild(pix[i]);
      }

      return pixels;

    }
  }

  function analyseImage (imagePath, done) {

    'use strict';
    
    var img = new Image();
    img.addEventListener('load', onImageLoaded);
    img.crossOrigin = "Anonymous";
    img.src = imagePath;

    function onImageLoaded () {
      
      var canvas = document.createElement('canvas');
      canvas.setAttribute('width', this.width);
      canvas.setAttribute('height', this.height);
      
      var ctx = prepareCanvas(canvas);
      
      ctx.drawImage(this, 0, 0);

      var imageData = ctx.getImageData(0, 0, this.width, this.height);
      var colors    = parseColorBytes(imageData.data);

      done({
        colors: colors,
        image: img
      });
            
      function prepareCanvas (canvas) {
        if (canvas && canvas.getContext) {
          return canvas.getContext('2d') || null;
        }
      }
    }

    function parseColorBytes (pixBits) {

      var colors = { all: [], unique: [] };

      for (var i = 0; i < pixBits.length; i += 4) {

        var r = pixBits[i + 0];
        var g = pixBits[i + 1];
        var b = pixBits[i + 2];
        var a = pixBits[i + 3];
        a = Math.round((a / 255) * 1000) / 1000;

        var color = (a < 1 ? 'rgba' : 'rgb') + '(' + r + ', ' + g + ', ' + b + ( a < 1 ? ', ' + a : '' ) + ')';

        colors.all.push(color);
                
        if (!~colors.unique.indexOf(color)) {
          colors.unique.push(color);
        }
      }
      
      return colors;
    }
  }

})();