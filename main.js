require("js/utility/broadcaster");
require("js/utility/state_manager");
require("js/utility/math_extension");
require("js/utility/vector");
require("js/utility/weighted_collection");
require("js/utility/helper");
require("js/utility/sprite_animation");

require("js/menu/menu_state");

var RenderTargets = RenderTargets || {
	default: RenderTarget.new("Default"),
	ui: RenderTarget.new("UI")
}

Game.Initialise = function()
{
	Game.setName("Firefly - From Past To Present");

	RenderSettings.setVsync(true);
	RenderSettings.setResolution(800,600);
	RenderSettings.setYDown(true);
	RenderSettings.setWindowSize(800,600);
	RenderSettings.setCullMode(RenderSettings.CullNone);

	Game.debug = true;
	Game.speed = 1;

	ContentManager.loadFont("fonts/dinpro.otf", 16);
	ContentManager.loadFont("fonts/dinpro.otf", 24);
	ContentManager.loadFont("fonts/dinpro.otf", 32);
	ContentManager.loadFont("fonts/dinpro.otf", 48);
	ContentManager.loadFont("fonts/dinpro.otf", 64);
	ContentManager.loadFont("fonts/dinpro.otf", 72);

	ContentManager.loadFont("fonts/dinpro.otfb", 16);
	ContentManager.loadFont("fonts/dinpro.otfb", 24);
	ContentManager.loadFont("fonts/dinpro.otfb", 32);
	ContentManager.loadFont("fonts/dinpro.otfb", 48);
	ContentManager.loadFont("fonts/dinpro.otfb", 64);
	ContentManager.loadFont("fonts/dinpro.otfb", 72);

	ContentManager.load("shader", "shaders/pp_normal.fx");
	RenderTargets.ui.setShader("shaders/pp_normal.fx");

	StateManager.switchState(MenuState);
}

Game.Update = function(dt)
{
	if (Game.debug == true)
	{
		var oldSpeed = Game.speed;
		if (Keyboard.isReleased("OEM4"))
		{
			Game.speed /= 1.5;
		}
		else if (Keyboard.isReleased("OEM6"))
		{
			Game.speed *= 1.5;
		}

		if (oldSpeed != Game.speed)
		{
			Log.rgb("Game speed changed to: " + Game.speed, 255, 255, 255, 127, 127, 127);
		}

		dt *= Game.speed;
	}
	StateManager.update(dt);
}

Game.Draw = function(dt)
{
	StateManager.draw(dt);
}

Game.Shutdown = function()
{

}

Game.OnReload = function(path)
{
	StateManager.reload(path);
}