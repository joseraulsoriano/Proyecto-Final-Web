#!/bin/bash
# Script para convertir DOCUMENTACION.md a Word usando Pandoc
# Requiere: brew install pandoc (en macOS) o apt-get install pandoc (en Linux)

MD_FILE="DOCUMENTACION.md"
OUTPUT_FILE="DOCUMENTACION.docx"

# Verificar si Pandoc está instalado
if ! command -v pandoc &> /dev/null; then
    echo "Error: Pandoc no está instalado."
    echo ""
    echo "Instalación:"
    echo "  macOS:   brew install pandoc"
    echo "  Linux:   sudo apt-get install pandoc"
    echo "  Windows: Descargar desde https://pandoc.org/installing.html"
    exit 1
fi

# Verificar si el archivo existe
if [ ! -f "$MD_FILE" ]; then
    echo "Error: El archivo $MD_FILE no existe."
    exit 1
fi

echo "Convirtiendo $MD_FILE a $OUTPUT_FILE..."

# Convertir usando Pandoc
pandoc "$MD_FILE" \
    -o "$OUTPUT_FILE" \
    --from markdown \
    --to docx \
    --reference-doc=/System/Library/Templates/Applications/Pages.app/Contents/Resources/Templates/Blank.template/Contents/Resources/Blank.pages 2>/dev/null || \
pandoc "$MD_FILE" \
    -o "$OUTPUT_FILE" \
    --from markdown \
    --to docx

if [ $? -eq 0 ]; then
    echo "✓ Conversión exitosa: $OUTPUT_FILE"
else
    echo "✗ Error durante la conversión"
    exit 1
fi

