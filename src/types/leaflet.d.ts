declare namespace L {
  interface LatLng {
    lat: number;
    lng: number;
  }

  interface LeafletEvent {
    latlng: LatLng;
  }

  interface LayerOptions {
    attribution?: string;
    maxZoom?: number;
  }

  interface Layer {
    addTo(map: Map): this;
  }

  interface Marker extends Layer {
    setLatLng(latlng: LatLng): this;
  }

  interface Map {
    setView(center: LatLng | [number, number], zoom: number): this;
    on(type: string, fn: (e: LeafletEvent) => void): this;
    remove(): void;
    removeLayer(layer: Layer): this;
  }

  function map(element: HTMLElement): Map;
  function tileLayer(urlTemplate: string, options?: LayerOptions): Layer;
  function marker(latlng: LatLng | [number, number]): Marker;
}

interface Window {
  L: typeof L;
}