uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vUv = uv;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}