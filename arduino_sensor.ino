// Sketch Arduino pour collecte de données capteurs
// Pour l'instant, utilise des valeurs aléatoires. Remplacer par vrais capteurs plus tard.

void setup()
{
    Serial.begin(9600);        // Communication série avec Raspberry Pi
    randomSeed(analogRead(0)); // Initialiser le générateur aléatoire
}

void loop()
{
    // Générer des données simulées (remplacer par lectures de capteurs réels)
    float temperature = random(15, 30) + random(0, 100) / 100.0; // 15-30°C
    float humidity = random(30, 80) + random(0, 100) / 100.0;    // 30-80%
    int luminosity = random(1000, 15000);                        // 1000-15000 lx
    int co2 = random(300, 1000);                                 // 300-1000 ppm
    bool presence = random(0, 2);                                // 0 ou 1

    // Envoyer les données au format JSON via Serial
    Serial.print("{");
    Serial.print("\"temperature\":");
    Serial.print(temperature);
    Serial.print(",\"humidity\":");
    Serial.print(humidity);
    Serial.print(",\"luminosity\":");
    Serial.print(luminosity);
    Serial.print(",\"CO2\":");
    Serial.print(co2);
    Serial.print(",\"presence\":");
    Serial.print(presence ? "true" : "false");
    Serial.println("}");

    delay(5000); // Attendre 5 secondes avant la prochaine lecture
}