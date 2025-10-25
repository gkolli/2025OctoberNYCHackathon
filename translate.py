import deepl
import json
import os

# --- CONFIGURATION ---
# Replace 'YOUR_DEEPL_API_KEY' with your actual DeepL API key
API_KEY = "4d3c30c3-4978-45ed-9bde-a49933fb115b:fx"

# The path to your source English JSON file
SOURCE_FILE = "en.json"

# List of target languages (DeepL language codes)
# The output file will be named based on the code (e.g., 'de.json')
TARGET_LANGUAGES = {
    "DE": "German",
    "JA": "Japanese",
    "FR": "French",
    "AR": "Arabic"
}
# ---------------------

def translate_json_file():
    """Reads the source JSON, translates its values, and saves new language JSONs."""
    
    # 1. Initialize DeepL Translator
    try:
        translator = deepl.Translator(API_KEY)
        # Verify the key (optional, but good practice)
        usage = translator.get_usage()
        if usage.any_limit_reached:
            print(f"⚠️ DeepL usage limit reached. Cannot proceed.")
            return
        print(f"DeepL API Key is valid. Characters remaining this month: {usage.character.limit - usage.character.count}")
    except Exception as e:
        print(f"❌ Error initializing DeepL translator: {e}")
        print("Please check your API key.")
        return

    # 2. Load the source JSON file
    try:
        with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
            source_data = json.load(f)
        print(f"Successfully loaded source file: {SOURCE_FILE}")
    except FileNotFoundError:
        print(f"❌ Error: {SOURCE_FILE} not found. Make sure the file is in the same directory.")
        return
    except json.JSONDecodeError:
        print(f"❌ Error: Could not decode JSON from {SOURCE_FILE}. Check the file format.")
        return
    
    # 3. Iterate through target languages and translate
    for target_code, lang_name in TARGET_LANGUAGES.items():
        print(f"\n--- Translating to {lang_name} ({target_code}) ---")
        
        translated_data = {}
        
        # Iterate over key-value pairs in the source JSON
        for key, value in source_data.items():
            if isinstance(value, dict):
                translated_data[key] = {}
                for sub_key, sub_value in value.items():
                    if isinstance(sub_value, dict):
                        translated_data[key][sub_key] = {}
                        for sub_sub_key, sub_sub_value in sub_value.items():
                            if isinstance(sub_sub_value, str) and sub_sub_value.strip():
                                try:
                                    # DeepL translation call
                                    result = translator.translate_text(
                                        sub_sub_value,
                                        source_lang="EN",
                                        target_lang=target_code,
                                        tag_handling="xml" # Good practice for translation of HTML/XML-like content
                                    )
                                    translated_data[key][sub_key][sub_sub_key] = result.text
                                except deepl.DeepLError as e:
                                    print(f"⚠️ DeepL Error for key '{key}.{sub_key}.{sub_sub_key}': {e}. Skipping this translation.")
                                    translated_data[key][sub_key][sub_sub_key] = sub_sub_value # Fallback to original text
                                except Exception as e:
                                    print(f"❌ An unexpected error occurred for key '{key}.{sub_key}.{sub_sub_key}': {e}. Skipping.")
                                    translated_data[key][sub_key][sub_sub_key] = sub_sub_value
                            else:
                                translated_data[key][sub_key][sub_sub_key] = sub_sub_value
                    elif isinstance(sub_value, str) and sub_value.strip():
                        try:
                            # DeepL translation call
                            result = translator.translate_text(
                                sub_value,
                                source_lang="EN",
                                target_lang=target_code,
                                tag_handling="xml" # Good practice for translation of HTML/XML-like content
                            )
                            translated_data[key][sub_key] = result.text
                        except deepl.DeepLError as e:
                            print(f"⚠️ DeepL Error for key '{key}.{sub_key}': {e}. Skipping this translation.")
                            translated_data[key][sub_key] = sub_value # Fallback to original text
                        except Exception as e:
                            print(f"❌ An unexpected error occurred for key '{key}.{sub_key}': {e}. Skipping.")
                            translated_data[key][sub_key] = sub_value
                    else:
                        translated_data[key][sub_key] = sub_value
            elif isinstance(value, str) and value.strip():
                try:
                    # DeepL translation call
                    result = translator.translate_text(
                        value,
                        source_lang="EN",
                        target_lang=target_code,
                        tag_handling="xml" # Good practice for translation of HTML/XML-like content
                    )
                    translated_data[key] = result.text
                except deepl.DeepLError as e:
                    print(f"⚠️ DeepL Error for key '{key}': {e}. Skipping this translation.")
                    translated_data[key] = value # Fallback to original text
                except Exception as e:
                    print(f"❌ An unexpected error occurred for key '{key}': {e}. Skipping.")
                    translated_data[key] = value
            else:
                # Handle non-string or empty values (e.g., nested objects, numbers)
                translated_data[key] = value

        # 4. Save the translated JSON file
        output_file = f"{target_code.lower()}.json"
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(translated_data, f, indent=4, ensure_ascii=False)
            print(f"✅ Successfully saved translation to {output_file}")
        except Exception as e:
            print(f"❌ Error saving file {output_file}: {e}")


if __name__ == "__main__":
    translate_json_file()