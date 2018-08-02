//============================================================
// STUDENT NAME: Lai Zhin Hou Darryl
// MATRIC NO.  : A0122534R
// NUS EMAIL   : a0122534@u.nus.edu
// COMMENTS TO GRADER:
// <comments to grader, if any>
//
//============================================================
//
// FILE: assign1.frag


//==========================================================================
// Eye-space position and vectors for setting up a tangent space at the fragment.
//==========================================================================

varying vec3 ecPosition;    // Fragment's 3D position in eye space.
varying vec3 ecNormal;      // Fragment's normal vector in eye space.
varying vec3 ecTangent;     // Frgament's tangent vector in eye space.


//==========================================================================
// TileDensity specifies the number of tiles to span across each dimension when the
// texture coordinates gl_TexCoord[0].s and gl_TexCoord[0].t range from 0.0 to 1.0.
//==========================================================================

uniform float TileDensity;  // (0.0, inf)


//==========================================================================
// TubeRadius is the radius of the semi-circular mirror tubes that run along 
// the boundary of each tile. The radius is relative to the tile size, which 
// is considered to be 1.0 x 1.0.
//==========================================================================

uniform float TubeRadius;  // (0.0, 0.5]


//==========================================================================
// StickerWidth is the width of the square sticker. The entire square sticker 
// must appear at the center of each tile. The width is relative to the 
// tile size, which is considered to be 1.0 x 1.0.
//==========================================================================

uniform float StickerWidth;  // (0.0, 1.0]


//==========================================================================
// EnvMap references the environment cubemap for reflection mapping.
//==========================================================================

uniform samplerCube EnvMap;


//==========================================================================
// DiffuseTex1 references the wood texture map whose color is used to 
// modulate the ambient and diffuse lighting components on the non-mirror and
// non-sticker regions.
//==========================================================================

uniform sampler2D DiffuseTex1;


//==========================================================================
// DiffuseTex2 references the sticker texture map whose color is used to 
// modulate the ambient and diffuse lighting components on the sticker regions.
//==========================================================================

uniform sampler2D DiffuseTex2;




void main()
{
	vec2 c = TileDensity * gl_TexCoord[0].st;
    vec2 p = fract( c ) - vec2( 0.5 );

	// Textures
	vec3 wood = vec3(texture2D(DiffuseTex1, gl_TexCoord[0].st ));
	vec3 sticker = vec3(texture2D(DiffuseTex2, p/StickerWidth + vec2(0.5)));
	
    // Some useful eye-space vectors.
    vec3 ecNNormal = normalize( ecNormal );
    vec3 ecViewVec = -normalize( ecPosition	);
	
	// Light
	vec3 lightPos = vec3( gl_LightSource[0].position ) / gl_LightSource[0].position.w;
	vec3 ecLightVec = normalize( lightPos - ecPosition );
	vec3 ecHalfVector = normalize( ecLightVec + ecViewVec );
	
	// Default reflectVec
	vec3 ecReflectVec = reflect(-ecLightVec, ecNNormal); // The mirror reflection vector in eye space.
	
	//======================================================================
	// By default, assume fragment is in the wood region.
	//======================================================================
	//* 
	float N_dot_L = (gl_FrontFacing) ? max( 0.0, dot( ecNNormal, ecLightVec ) ) : 
	max( 0.0, dot( -ecNNormal, ecLightVec ) );
	float N_dot_H = (gl_FrontFacing) ? max( 0.0, dot( ecNNormal, ecHalfVector ) ) : 
	max( 0.0, dot( ecNNormal, ecHalfVector ) );

	float pf = ( N_dot_H == 0.0 )? 0.0 : pow( N_dot_H, gl_FrontMaterial.shininess );
	
	float spec = clamp(dot(ecReflectVec, ecViewVec), 0.0, 1.0);
	spec = pow(spec, 16.0);

	gl_FragColor = wood * 
	(gl_LightSource[0].ambient + 
	gl_LightSource[0].diffuse * N_dot_L) +
	gl_LightSource[0].specular * pf;
	
	//////////////////////////////////////////////////////////
    // REPLACE THE CONDITION IN THE FOLLOWING IF STATEMENT. //
    //////////////////////////////////////////////////////////
	//======================================================================
	// In here, fragment is front-facing and in the sticker region.
	//======================================================================
	//* 
	
	float StickerRadius = StickerWidth/2;
    if ( ( gl_FrontFacing ) && 
	(abs(p.x) < StickerRadius && abs(p.y) < StickerRadius) )
    {
		gl_FragColor = sticker* 
		(gl_LightSource[0].ambient + 
		gl_LightSource[0].diffuse * N_dot_L) +
		gl_LightSource[0].specular * pf;
	}

	///////////////////////////
	// WRITE YOUR CODE HERE. //
	///////////////////////////
	
	//======================================================================
	// In here, fragment is front-facing and in the mirror-like bump region.
	//======================================================================
	//*
	if (( gl_FrontFacing ) &&
	(abs(p.x) >= 0.5 - TubeRadius || 
	abs(p.y) >= 0.5 - TubeRadius)) {
		vec3 N = ecNormal;
		vec3 B = normalize( cross( N, ecTangent ) );
		vec3 T = cross( B, N );
	
		vec3 v = vec3(0.0);
		float x, y, z;
		if (abs(p.x) > abs(p.y) ) {
			v.z = TubeRadius;
			// find p.x and p.y from the edge
			// translate p.x p.y from edge to center coordinates
			v.x = (p.x > 0) ? p.x - 0.5 : p.x + 0.5;
			v.y = 0.0; 
		} else {
			v.z = TubeRadius;
			// find p.x and p.y from the edge
			// translate p.x p.y from edge to center coordinates
			v.x = 0.0;
			v.y = (p.y > 0) ? p.y - 0.5 : p.y + 0.5; 
		}
		vec3 tanPerturbedNormal = normalize( v ); // The perturbed normal vector in tangent space of fragment.
		v.x = dot(T, tanPerturbedNormal); 
		v.y = dot(B, tanPerturbedNormal); 
		v.z = dot(N, tanPerturbedNormal); 
		vec3 ecPerturbedNormal = normalize( v ); // The perturbed normal vector in eye space.
		
		ecReflectVec = reflect(-ecViewVec, ecPerturbedNormal);
		
		gl_FragColor = textureCube(EnvMap, ecReflectVec);
		//ecReflectVec = reflect(-ecViewVec, ecNNormal);
	}//*/
}
