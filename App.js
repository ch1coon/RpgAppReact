import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import defaultCharacterCreationSheet from "./data/playerCharacterSheetDefault.json";


const App = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedRace, setSelectedRace] = useState("");
  const [selectedSubrace, setSelectedSubrace] = useState("");
  const subraceDropdownRef = useRef(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState("");
  const [selectedBackground, setSelectedBackground] = useState("");
  const [selectedAlignment, setSelectedAlignment] = useState([]);
  const [raceOptions, setRaceOptions] = useState([]);
  const [alignmentOptions, setAlignmentOptions] = useState([]);
  const [subraceOptions, setSubraceOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [backgroundOptions, setBackgroundOptions] = useState([]);
  const [subraceDropdownEnabled, setSubraceDropdownEnabled] = useState(false);

  useEffect(() => {
    carregarOpcoesRacas();
    carregarOpcoesClasses();
    carregarOpcoesBackgrounds();
    carregarOpcoesTendencias();
  }, []);

  const handleFirstNameChange = (text) => {
    setFirstName(text);
  };

  const handleLastNameChange = (text) => {
    setLastName(text);
  };

  const carregarOpcoesClasses = async () => {
    try {
      const classFiles = [
        require('./data/class/class-artificer.json'),
        require('./data/class/class-barbarian.json'),
        require('./data/class/class-bard.json'),
        require('./data/class/class-cleric.json'),
        require('./data/class/class-druid.json'),
        require('./data/class/class-fighter.json'),
        require('./data/class/class-monk.json'),
        require('./data/class/class-mystic.json'),
        require('./data/class/class-paladin.json'),
        require('./data/class/class-ranger.json'),
        require('./data/class/class-rogue.json'),
        require('./data/class/class-sorcerer.json'),
        require('./data/class/class-warlock.json'),
        require('./data/class/class-wizard.json'),
      ];
  
      const classOptions = [];
  
      classFiles.forEach((classData) => {
        if (Array.isArray(classData.class)) {
          classData.class.forEach((classObj) => {
            const classWithName = classObj.name.toString() + (classObj.source ? ` (${classObj.source})` : '');
            classOptions.push(classObj);
            classObj.nameWithSource = classWithName;
          });
        } else {
          const classWithName = classData.class.name.toString();
          classOptions.push(classData.class);
          classData.class.nameWithSource = classWithName;
        }
      });
  
      setClassOptions(classOptions);
    } catch (error) {
      console.log(error);
    }
  };
  
  function carregarOpcoesBackgrounds() {
    const backgroundsData = require("./data/backgrounds.json");
    const backgroundsOptions = new Set();

    backgroundsData.background.forEach((background) => {
      const backgroundsOption = `${background.name} (${background.source})`;
      backgroundsOptions.add(backgroundsOption);
    });

    setBackgroundOptions(Array.from(backgroundsOptions));
  }

  function carregarOpcoesRacas() {
    const racesData = require("./data/races.json");
    const uniqueRaces = new Set();

    const races = racesData.race
      .map((race) => {
        const raceName = race.name.replace(/\s*\([^)]*\)/g, "").trim(); // Remover conteúdo entre parênteses
        if (
          !uniqueRaces.has(raceName) &&
          (!race.traitTags || !race.traitTags.includes("NPC Race"))
        ) {
          uniqueRaces.add(raceName);
          return raceName;
        }
      })
      .filter(Boolean);

    setRaceOptions(races);
  }

  function carregarOpcoesSubracas(selectedRaceName) {
    const racesData = require("./data/races.json");
    const subracesOptions = new Set();
    const subracesMap = {}; // Variável para armazenar as subraças correspondentes ao nome
  
    racesData.race.forEach((race) => {
      if (race.name.includes(selectedRaceName) && (!race.traitTags || !race.traitTags.includes("NPC Race"))) {
        const raceOption = `${race.name} (${race.source})`;
        subracesOptions.add(raceOption);
      }
    });
  
    racesData.subrace.forEach((subrace) => {
      if (
      subrace.raceName === selectedRaceName &&
      subrace.name &&
      (!subrace.traitTags || !subrace.traitTags.includes("NPC Race"))
      ) {
        const subraceOption = `${subrace.name} (${subrace.source})`;
  
        if (!subracesMap[subraceOption]) {
          subracesMap[subraceOption] = subrace;
          subracesOptions.add(subraceOption);
        }
      }
    });
  
    setSubraceOptions([...subracesOptions]);
  }
  
  
  

  function carregarOpcoesTendencias() {
    const alignmentOptions = [
      {
        name: "Lawful Good",
        values: ["L", "G"],
      },
      {
        name: "Neutral Good",
        values: ["N", "G"],
      },
      {
        name: "Chaotic Good",
        values: ["C", "G"],
      },
      {
        name: "Lawful Neutral",
        values: ["L", "N"],
      },
      {
        name: "Neutral",
        values: ["N"],
      },
      {
        name: "Chaotic Neutral",
        values: ["C", "N"],
      },
      {
        name: "Lawful Evil",
        values: ["L", "E"],
      },
      {
        name: "Neutral Evil",
        values: ["N", "E"],
      },
      {
        name: "Chaotic Evil",
        values: ["C", "E"],
      },
    ];
  
    setAlignmentOptions(alignmentOptions.map((alignment) => alignment.name));
    
  }

  const handleRaceChange = (value) => {
    setSelectedRace(value);
    setSelectedSubrace("");
    setSubraceDropdownEnabled(!!value);

    if (subraceDropdownRef.current) {
      subraceDropdownRef.current.reset();
    }

    if (value) {
      carregarOpcoesSubracas(value);
    } else {
      setSubraceOptions([]);
    }
  };

  const handleSubraceChange = (value) => {
    setSelectedSubrace(value);
  };

  const handleClassChange = (value) => {
    setSelectedClass(value);
  };

  const handleArchetypeChange = (value) => {
    setSelectedArchetype(value);
  };

  const handleBackgroundChange = (value) => {
    setSelectedBackground(value);
  };

  const handleAlignmentChange = (value) => {
    setSelectedAlignment(value);
  };
  function handleSubmitSheet() {
    // Criar uma cópia profunda do objeto defaultCharacterCreationSheet
    const newCharacterSheet = JSON.parse(
      JSON.stringify(defaultCharacterCreationSheet)
    );
    const fullName = firstName + " " + lastName;

    // Armazenar os valores selecionados nos locais apropriados do novo objeto
    newCharacterSheet.characterSheet[0].characterName = fullName;
    newCharacterSheet.characterSheet[0].race = selectedSubrace;
    newCharacterSheet.characterSheet[0].background = selectedBackground;
    newCharacterSheet.characterSheet[0].alignment = selectedAlignment;



    newCharacterSheet.characterSheet[0].class = selectedClass;
    newCharacterSheet.characterSheet[0].level = 1;
    // ... continuar com os outros valores selecionados

    // Imprimir o novo objeto JSON no console
    console.log(newCharacterSheet);
  }

  return (
    <View style={styles.container}>
      <Text>First and last name</Text>
      <TextInput
        style={styles.input}
        placeholder="First name"
        value={firstName}
        onChangeText={handleFirstNameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Last name"
        value={lastName}
        onChangeText={handleLastNameChange}
      />

      <Text>Raça</Text>
      <SelectDropdown
        data={raceOptions}
        onSelect={handleRaceChange}
        defaultButtonText="Raça"
        buttonStyle={styles.dropdownButton}
        dropdownStyle={styles.dropdown}
      />

      <Text>Sub-Raça</Text>
      <SelectDropdown
        ref={subraceDropdownRef}
        data={subraceOptions}
        onSelect={handleSubraceChange}
        defaultButtonText="Sub-Raça"
        buttonStyle={styles.dropdownButton}
        dropdownStyle={styles.dropdown}
        disabled={!subraceDropdownEnabled}
      />

<Text>Classe</Text>
<SelectDropdown
  data={classOptions}
  onSelect={handleClassChange}
  defaultButtonText="Classe"
  buttonStyle={styles.dropdownButton}
  dropdownStyle={styles.dropdown}
  buttonTextAfterSelection={(selectedItem) => selectedItem.nameWithSource}
  rowTextForSelection={(item) => item.nameWithSource}
/>


      <Text>Arquétipo</Text>
      <TextInput
        style={styles.input}
        placeholder="Arquétipo"
        value={selectedArchetype}
        onChangeText={handleArchetypeChange}
      />

      <Text>Background</Text>
      <SelectDropdown
        data={backgroundOptions}
        onSelect={handleBackgroundChange}
        defaultButtonText="Background"
        buttonStyle={styles.dropdownButton}
        dropdownStyle={styles.dropdown}
      />

      <Text>Tendências</Text>
      <SelectDropdown
        data={alignmentOptions}
        onSelect={handleAlignmentChange}
        defaultButtonText="Tendências"
        buttonStyle={styles.dropdownButton}
        dropdownStyle={styles.dropdown}
      />
      <Button title="Submit Sheet" onPress={handleSubmitSheet} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dropdownButton: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    maxHeight: 200,
  },
});

export default App;
