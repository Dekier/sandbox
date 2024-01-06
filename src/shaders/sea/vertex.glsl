#include <fog_pars_vertex>

varying vec2 vUv;

void main() {

vUv = uv;

#include <begin_vertex>
#include <project_vertex>
#include <fog_vertex>

}