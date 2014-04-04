// ----------------------------------------------------------------------------
// File: FaderTests.js
//
// Copyright (c) 2014 VoodooJs Authors
// ----------------------------------------------------------------------------



/**
 * Test cases to make sure the Fader class works as expected.
 *
 * @constructor
 */
FaderTests = TestCase('FaderTests');


/**
 * Shutdown the engine between test cases.
 */
FaderTests.prototype.tearDown = function() {
  var voodooEngine = voodoo.engine;
  if (voodooEngine)
    voodooEngine.destroy();
};


/**
 * Tests that the Fader class may be extended from other types.
 */
FaderTests.prototype.testFaderExtend = function() {
  var FadedBase = SimpleModel.extend(voodoo.Fader);
  var BaseFaded = voodoo.Fader.extend(SimpleModel);

  var instance1 = new FadedBase();
  var instance2 = new BaseFaded();

  instance1.fadeIn(1);
  instance2.fadeTo(0.5, 1);
};


/**
 * Tests that the fadeBegin and fadeEnd events work correctly.
 */
FaderTests.prototype.testFaderEvents = function() {
  var Fader = voodoo.Fader.extend(DummyModel);
  var instance = new Fader();

  var fadeInBegin = false;
  var fadeInEnd = false;
  var fadeOutBegin = false;
  var fadeOutEnd = false;
  var alphaChange = false;

  instance.on('fadeBegin', function() {
    var instanceAlpha = instance.alpha;
    if (instanceAlpha === 0)
      fadeInBegin = true;
    else if (instanceAlpha === 1)
      fadeOutBegin = true;
  });

  instance.on('fadeEnd', function() {
    var instanceAlpha = instance.alpha;
    if (instanceAlpha === 0) {
      fadeOutEnd = true;
    } else if (instanceAlpha === 1) {
      fadeInEnd = true;
      this.fadeOut(0.0001);
    }
  });

  instance.on('alphaChange', function() {
    alphaChange = true;
  });

  instance.fadeIn(0.0001);

  assertEquals(1.0, instance.targetAlpha);

  var start = new Date;
  var voodooEngine = voodoo.engine;
  while (!fadeOutEnd && new Date() - start < 1000)
    voodooEngine.frame();

  assert('Fade In Begin', fadeInBegin);
  assert('Fade Out Begin', fadeOutBegin);
  assert('Fade In End', fadeInEnd);
  assert('Fade Out End', fadeOutEnd);
  assert('Alpha change', alphaChange);
};


/**
 * Tests that alpha values may be changed immediately.
 */
FaderTests.prototype.testFaderSetAlpha = function() {
  var FadedBase = SimpleModel.extend(voodoo.Fader);
  var instance = new FadedBase();

  instance.setAlpha(0.5);
  assertEquals(0.5, instance.alpha);

  instance.alpha = 0.8;
  assertEquals(0.8, instance.alpha);
};


/**
 * Tests that fading may be paused.
 */
FaderTests.prototype.testPause = function() {
  var Fader = voodoo.Fader.extend(DummyModel);
  var instance = new Fader();

  instance.fadeIn(0.1);

  var start = new Date;
  var voodooEngine = voodoo.engine;
  while (new Date() - start < 50)
    voodooEngine.frame();

  assertTrue('Fading:', instance.fading);
  instance.fading = false;

  var start = new Date;
  var voodooEngine = voodoo.engine;
  while (new Date() - start < 25)
    voodooEngine.frame();

  instance.fading = true;

  var start = new Date;
  var voodooEngine = voodoo.engine;
  while (instance.fading && new Date() - start < 100)
    voodooEngine.frame();

  assertFalse('Fading:', instance.fading);
};
