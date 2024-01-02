# Assuming you have themes and variants defined as lists
themes = ['classicGreen', 'light', 'purpleMoonlight', 'pink']  # Add more themes as needed
variants = ['primary', 'secondary', 'accentOne', 'accentTwo']  # Add more variants as needed

def generate_safelist():
    safelist = []

    for theme in themes:
        for variant in variants:
            # Background colors
            safelist.append(f"bg-{theme}-{variant}")

            # Text colors
            safelist.append(f"text-{theme}-{variant}")

            # Border colors
            safelist.append(f"border-{theme}-{variant}")

            # Hover states
            safelist.append(f"hover:bg-{theme}-{variant}")
            safelist.append(f"hover:text-{theme}-{variant}")
            safelist.append(f"hover:border-{theme}-{variant}")

            # Focus states
            safelist.append(f"focus:bg-{theme}-{variant}")
            safelist.append(f"focus:text-{theme}-{variant}")
            safelist.append(f"focus:border-{theme}-{variant}")
            safelist.append(f"focus:ring-{theme}-{variant}")

            # Placeholder states
            safelist.append(f"placeholder-{theme}-{variant}")

            # Active states
            safelist.append(f"active:bg-{theme}-{variant}")
            safelist.append(f"active:text-{theme}-{variant}")
            safelist.append(f"active:border-{theme}-{variant}")

            # Disabled states
            safelist.append(f"disabled:bg-{theme}-{variant}")
            safelist.append(f"disabled:text-{theme}-{variant}")
            safelist.append(f"disabled:border-{theme}-{variant}")

    return safelist

if __name__ == "__main__":
    safelist = generate_safelist()
    with open('safelist.txt', 'w') as file:
        formatted_safelist = ',\n  '.join(f'"{className}"' for className in safelist)
        file.write(f"module.exports = {{\n  safelist: [\n  {formatted_safelist}\n  ]\n}};\n")
