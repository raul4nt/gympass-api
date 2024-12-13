export interface Coordinate {
  latitude: number // latitude da coordenada
  longitude: number // longitude da coordenada
}

export function getDistanceBetweenCoordinates(
  from: Coordinate, // coordenada de origem
  to: Coordinate, // coordenada de destino
) {
  // verifica se as coordenadas são iguais
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0 // se forem iguais, a distância é 0
  }

  // converte a latitude de origem para radianos
  const fromRadian = (Math.PI * from.latitude) / 180
  // converte a latitude de destino para radianos
  const toRadian = (Math.PI * to.latitude) / 180

  // calcula a diferença de longitude entre as coordenadas
  const theta = from.longitude - to.longitude
  // converte a diferença de longitude para radianos
  const radTheta = (Math.PI * theta) / 180

  // aplica a fórmula de Haversine para calcular a distância
  let dist =
    Math.sin(fromRadian) * Math.sin(toRadian) + // parte da fórmula
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta) // parte da fórmula

  // se o valor calculado for maior que 1, limita a 1 para evitar erros de precisão
  if (dist > 1) {
    dist = 1
  }

  // calcula o arco cosseno do valor
  dist = Math.acos(dist)
  // converte de radianos para graus
  dist = (dist * 180) / Math.PI
  // converte de milhas para quilômetros
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344

  return dist // retorna a distância em quilômetros

  // retorna em km a distancia
}
