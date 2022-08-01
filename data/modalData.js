const modalData = {
  pregnancy: {
    title: "Prowadzenie ciąży",
    description: `<p class='paragraph'>Prowadzenie ciazy - Opiekę nad ciężarną staramy rozpocząć się jak najwcześniej. W naszym centrum, przyszłe mamy czeka wybór ginekologa, który poprowadzi je przez cały okres ciąży.</p> <p class='paragraph'>Częstość wizyt jest indywidualnie dostosowana do potrzeb pacjentki oraz do stopnia ewentualnego ryzyka medycznego. Wizyty odbywają się w intymnej i przyjaznej atmosferze. Prowadzenie ciąży jest zindywidualizowane i dostosowane do potrzeb i oczekiwań kobiety.</p>`,
  },
  usg: {
    title: "USG 3d 2d",
    description: `<p class='paragraph'>USG 2D I 3D - Opiekę nad ciężarną staramy rozpocząć się jak najwcześniej. W naszym centrum, przyszłe mamy czeka wybór ginekologa, który poprowadzi je przez cały okres ciąży.</p> <p class='paragraph'>Częstość wizyt jest indywidualnie dostosowana do potrzeb pacjentki oraz do stopnia ewentualnego ryzyka medycznego. Wizyty odbywają się w intymnej i przyjaznej atmosferze. Prowadzenie ciąży jest zindywidualizowane i dostosowane do potrzeb i oczekiwań kobiety.</p>`,
  },
  dentist: {
    title: "Super dentysta",
    description: `<p class='paragraph'>Super hiper fajny dentysta - Opiekę nad ciężarną staramy rozpocząć się jak najwcześniej. W naszym centrum, przyszłe mamy czeka wybór ginekologa, który poprowadzi je przez cały okres ciąży.</p> <p class='paragraph'>Częstość wizyt jest indywidualnie dostosowana do potrzeb pacjentki oraz do stopnia ewentualnego ryzyka medycznego. Wizyty odbywają się w intymnej i przyjaznej atmosferze. Prowadzenie ciąży jest zindywidualizowane i dostosowane do potrzeb i oczekiwań kobiety.</p>`,
  },
};

const getTextById = (id) => {
  try {
    if (typeof id !== "string" || !modalData[id])
      throw new Error("Modal text not found!");
    return modalData[id];
  } catch (err) {
    console.log(err);
  }
};
