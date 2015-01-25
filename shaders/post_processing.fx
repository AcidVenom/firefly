cbuffer ConstantBuffer : register(b0)
{
	float Time;
}

cbuffer Uniforms : register(b1)
{

}

struct VOut
{
	float4 position : SV_POSITION;
	float4 colour : COLOUR;
	float2 texcoord : TEXCOORD0;
};

VOut VS(float4 position : POSITION, float3 normal : NORMAL, float2 texcoord : TEXCOORD0, float4 colour : COLOUR)
{
	VOut output;
	output.position = position;
	output.texcoord = texcoord;
	output.colour = colour;
	return output;
}

Texture2D tex2D;
SamplerState SampleType;

float4 PS(VOut input) : SV_TARGET
{
	input.texcoord.y += sin(Time *1000)/2000;
	float4 colour = tex2D.Sample(SampleType, input.texcoord);
	colour.rgb *= sin(input.texcoord.x*3.14) * 0.8;
	colour.rgb *= sin(input.texcoord.y*3.14) * 0.8;
	colour.a += sin(Time*10000)/40 + cos(Time*1000)/100;

	float val = 700 + sin(Time*1000)*0.5;
	colour.g *= sin(input.texcoord.y*val)+2;
	colour.b *= sin(input.texcoord.y*val)+2.5;
	colour.r *= sin(input.texcoord.y*val)+2;

	colour.rg *= 1.2;
	colour.rg += 0.07;
	colour.b += 0.03;

	if (sin(input.texcoord.x*3.14) * sin(input.texcoord.y*3.14) < 0.05)
	{
		float v = sin(input.texcoord.x*3.14) * sin(input.texcoord.y*3.14);
		float col = (0.5-((1-v*10)*0.5))*0.25;
		return float4(col,col,col,1);
	}
	return colour;
}