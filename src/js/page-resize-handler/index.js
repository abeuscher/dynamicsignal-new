

function AssignResizeClasses(bps) {
    var timeout = false,
      delay = 250;
      
    function getDimensions() {
      var w = window.innerWidth;
      var bpsArray = Object.keys(bps).map(function(key) {
        return [key, bps[key]];
      });
      var pageClass = bpsArray[0][0];
      for (i=1;i<bpsArray.length;i++) {
        document.body.classList.remove(bpsArray[i][0]);
        if (w>parseInt(bpsArray[i-1][1])) {
          pageClass = bpsArray[i][0];
        }
      }
      document.body.classList.add(pageClass);
    }

    window.addEventListener('resize', function () {
      clearTimeout(timeout);
      timeout = setTimeout(getDimensions, delay);
    });
  
    getDimensions();
  
  }
  module.exports = AssignResizeClasses;