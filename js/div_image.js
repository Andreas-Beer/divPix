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

  analyseImage(img, divImage);

  /* Test */

  function divImage (analysedImage) {

    var parsedColors = analysedImage.parsedColors;
    var image = analysedImage.image;

    var head = document.getElementsByTagName('head')[0];
    var pic = document.getElementById('pic');
    var scaleFac = 10;

    var uniquClasses = parseUniqeClasses(parsedColors);
    var styleHead = createStyleHead(uniquClasses);
    var divPixels = createDivPixels(parsedColors, uniquClasses);

    // create the header
    var style = document.createElement('style');
    style.innerHTML = styleHead;
    head.appendChild(style);

    // append the pic 
    pic.appendChild(divPixels);
    pic.setAttribute('style', 'width:' + image.width * scaleFac + 'px; height:' + image.height * scaleFac + 'px;');

    function parseUniqeClasses (parsedColors) {

      var uniquClasses = { };

      for (var i = 0, count = 0; i < parsedColors.length; i++) {

        var currColor = parsedColors[i];

        if (!uniquClasses[currColor]) {

          var id = count;
          var color = currColor;
          var cssClass = 'color_' + count;
          var cssStyle = '.' + cssClass + '{ background-color:' + currColor + ' }\n';

          uniquClasses[currColor] = {
            id: id,
            color: color,
            cssStyle: cssStyle,
            cssClass: cssClass
          };

          count += 1;
        }
      }

      return uniquClasses;
    }

    function createStyleHead (object) {
      var style = '';
      for (var key in object) {
        style += object[key].cssStyle;
      }
      return style;
    }

    function createDivPixels (parsedColors, uniqueClasses) {

      var pixels = document.createElement('div');

      var pix = parsedColors.map(function (currColor) {

        var currClass = uniqueClasses[currColor].cssClass;
        var pixel = document.createElement('div');
        pixel.setAttribute('class', 'pix ' + currClass);

        return pixel;

      });

      for (var i = 0; i < pix.length; i++) {
        pixels.appendChild(pix[i]);
      }

      return pixels;

    }

  }

  function analyseImage (imagePath, ready) {

    'use strict';

    var canvas = document.getElementById('myCanvas');
    var content = prepareCanvas(canvas);

    var img = new Image();
    img.src = imagePath;
    img.crossOrigin = "Anonymous";
    img.addEventListener('load', onImageLoaded);

    function prepareCanvas (canvas) {
      if (canvas && canvas.getContext) {
        return canvas.getContext('2d') || null;
      }
    }

    function onImageLoaded () {

      /* jshint validthis: true */

      // set the canvas size equal to the img size.
      canvas.setAttribute('width', this.width);
      canvas.setAttribute('height', this.height);

      // draw the image on the canvas
      content.drawImage(this, 0, 0);

      // Create an ImageData object.
      var imgd = content.getImageData(0, 0, this.width, this.height);
      var parsedColors = parseColorBytes(imgd.data);
      var parsedImage = {
        parsedColors: parsedColors,
        image: img
      };

      ready(parsedImage);
    }

    function parseColorBytes (pixBits) {

      var parsedColors = [];

      for (var i = 0; i < pixBits.length; i += 4) {

        var r = pixBits[i + 0];
        var g = pixBits[i + 1];
        var b = pixBits[i + 2];
        var a = pixBits[i + 3];
        a = Math.round((a / 255) * 100) / 100;

        var px = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';

        parsedColors.push(px);
      }

      return parsedColors;
    }
  }

})();