export function generateName() {
  const vogais = "AEIOU";
  const consoantes = "BCDFGHJKLMNPQRSTVWXYZ";
  let nome = "";

  for (let i = 0; i < 3; i++) {
    const consoante = consoantes[Math.floor(Math.random() * consoantes.length)];
    const vogal = vogais[Math.floor(Math.random() * vogais.length)];
    nome += consoante + vogal;
  }

  return nome.charAt(0).toUpperCase() + nome.slice(1);
}
