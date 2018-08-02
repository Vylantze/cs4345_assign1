//============================================================
// STUDENT NAME: Lai Zhin Hou Darryl
// MATRIC NO.  : A0122534R
// NUS EMAIL   : a0122534@u.nus.edu
// COMMENTS TO GRADER:
// <comments to grader, if any>
//
//============================================================
//
// FILE: assign1.vert


varying vec3 ecPosition; // Vertex's position in eye space.
varying vec3 ecNormal;   // Vertex's normal vector in eye space.
varying vec3 ecTangent;  // Vertex's tangent vector in eye space.

attribute vec3 Tangent;  // Input vertex's tangent vector in model space.


void main( void )
{
    ///////////////////////////
    // WRITE YOUR CODE HERE. //
    ///////////////////////////

	ecNormal = normalize( gl_NormalMatrix * gl_Normal );
	ecPosition = vec3(gl_ModelViewMatrix * gl_Vertex);
	ecTangent = normalize(gl_NormalMatrix * Tangent);
	
	gl_TexCoord[0] = gl_MultiTexCoord0; 
	


	/* The vertex position written in the application using
	glVertex() can be read from the built-in variable
	gl_Vertex. Use this value and the current model
	view transformation matrix to tell the rasterizer where
	this vertex is.*/
	//gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
	gl_Position = ftransform();
}
