package control.prendario.DTO;

public class NumberToLetterConverter {
    private static final String[] UNIDADES = {
            "", "UN ", "DOS ", "TRES ", "CUATRO ", "CINCO ", "SEIS ", "SIETE ", "OCHO ", "NUEVE "
    };
    private static final String[] DECENAS = {
            "", "DIEZ ", "VEINTE ", "TREINTA ", "CUARENTA ", "CINCUENTA ", "SESENTA ", "SETENTA ", "OCHENTA ", "NOVENTA "
    };
    private static final String[] CENTENAS = {
            "", "CIENTO ", "DOSCIENTOS ", "TRESCIENTOS ", "CUATROCIENTOS ", "QUINIENTOS ", "SEISCIENTOS ",
            "SETECIENTOS ", "OCHOCIENTOS ", "NOVECIENTOS "
    };
    private static final String[] ESPECIALES = {
            "DIEZ ", "ONCE ", "DOCE ", "TRECE ", "CATORCE ", "QUINCE ", "DIECISEIS ", "DIECISIETE ", "DIECIOCHO ", "DIECINUEVE "
    };

    public static String convertNumberToLetter(double numero) {
        StringBuilder resultado = new StringBuilder();
        long parteEntera = (long) numero;

        if (parteEntera == 0) {
            return "CERO PESOS";
        }

        if (parteEntera >= 1000000) {
            int millones = (int) (parteEntera / 1000000);
            parteEntera = parteEntera % 1000000;
            if (millones == 1) {
                resultado.append("UN MILLON ");
            } else {
                resultado.append(convertirGrupo(millones)).append("MILLONES ");
            }
        }

        if (parteEntera >= 1000) {
            int miles = (int) (parteEntera / 1000);
            parteEntera = parteEntera % 1000;
            if (miles == 1) {
                resultado.append("MIL ");
            } else {
                resultado.append(convertirGrupo(miles)).append("MIL ");
            }
        }

        if (parteEntera > 0) {
            resultado.append(convertirGrupo((int) parteEntera));
        }

        return resultado.append("PESOS").toString().trim();
    }

    private static String convertirGrupo(int numero) {
        StringBuilder builder = new StringBuilder();

        int centenas = numero / 100;
        int decenas = (numero % 100) / 10;
        int unidades = numero % 10;

        // Manejo de centenas
        if (centenas == 1 && decenas == 0 && unidades == 0) {
            return "CIEN ";
        }
        if (centenas > 0) {
            builder.append(CENTENAS[centenas]);
        }

        // Manejo de decenas y unidades
        if (decenas == 1) {
            builder.append(ESPECIALES[unidades]);
        } else if (decenas == 2 && unidades > 0) {
            builder.append("VEINTI").append(UNIDADES[unidades].toLowerCase());
        } else {
            if (decenas > 0) {
                builder.append(DECENAS[decenas]);
                if (unidades > 0) {
                    builder.append("Y ").append(UNIDADES[unidades]);
                }
            } else if (unidades > 0) {
                builder.append(UNIDADES[unidades]);
            }
        }

        return builder.toString();
    }
}