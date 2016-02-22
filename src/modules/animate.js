import Velocity from 'velocity-animate';


export default function(container) {

  var svg = container.querySelector("svg");
  if (!svg) return;

  //regex is because svg loader adds crap to end of ids
  var icons = Array.prototype.slice.apply(svg.querySelectorAll("g[id^='weather-icons'] g"));

  function loopAnimate() {

    function animate(i) {
      var duration = 2000;
      var icon = icons[i];

      function rotateIn() {
        Velocity(icon, {
          rotateX: [0, 100],
          opacity: [1, 0]
        }, {
          duration: duration,
          complete: fadeOut
        })
      }

      function fadeOut() {
        Velocity(icon, {
          opacity: 0
        }, {
          duration: duration,
          begin: function() {
            if (i + 1 < icons.length) {
              animate(i + 1);
            } else {
              animate(0);
            }
          }
        })
      } //fadeout

      rotateIn();

    } // animate

    animate(0);

  } //loopanimate

  loopAnimate();

}
