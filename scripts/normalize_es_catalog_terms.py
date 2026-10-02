"""Correct small categorical terms that generic translation models misread."""

import json
from pathlib import Path


root = Path(__file__).resolve().parents[1] / "backend/src/main/resources/data/i18n"

axis_terms = {
    "estrutura": ("Estructura", "Federal", "Unitario"),
    "representacao": ("Representación", "Democracia", "Autocracia"),
    "poder": ("Poder", "Seguridad", "Libertad"),
    "imigracao": ("Inmigración", "Asimilación", "Multiculturalismo"),
    "diplomacia": ("Diplomacia", "Militarista", "Pacifista"),
    "intervencao": ("Intervención", "No intervencionista", "Nacionalista"),
    "economia": ("Economía", "Público", "Privado"),
    "controle": ("Control", "Planificación", "Mercado libre"),
    "comercio": ("Comercio", "Proteccionismo", "Globalismo"),
    "religiao": ("Religión", "Irreligioso", "Religioso"),
    "moral": ("Moralidad", "Progresista", "Tradicionalista"),
    "tecnologia": ("Tecnología", "Tecnología", "Biología"),
}
axes = json.loads((root / "es/axes.json").read_text(encoding="utf-8"))
for item in axes:
    item["label"], item["leftPole"], item["rightPole"] = axis_terms[item["id"]]
(root / "es/axes.json").write_text(json.dumps(axes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

category_terms = {
    "Radical Left": "Izquierda radical",
    "Left": "Izquierda",
    "Center": "Centro",
    "Right": "Derecha",
    "Far-Right": "Extrema derecha",
    "Third Position": "Tercera posición",
    "Libertarian": "Libertaria",
    "Anarchist": "Anarquista",
}
english = {item["id"]: item["category"] for item in json.loads((root / "en/ideologies.json").read_text(encoding="utf-8"))}
ideologies = json.loads((root / "es/ideologies.json").read_text(encoding="utf-8"))
for item in ideologies:
    item["category"] = category_terms[english[item["id"]]]
(root / "es/ideologies.json").write_text(json.dumps(ideologies, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

# Manual editorial pass for entries where the compact Argos model left an
# English title, a Portuguese phrase, or a malformed professional label.
ideology_names = {
    "socialismo-juche": "Socialismo Juche",
    "socialismo-pol-potista": "Socialismo de Pol Pot",
    "ecoautoritarismo": "Ecoautoritarismo",
    "alt-lite": "Alt-lite",
    "neorreacionarismo": "Neorreacción",
    "conservadorismo-cristao": "Conservadurismo cristiano",
    "tecnocracia": "Tecnocracia",
    "meritocracia": "Meritocracia",
    "liberalismo-social": "Liberalismo social",
    "reformismo-georgista": "Reformismo georgista",
    "ambientalismo": "Ambientalismo",
    "trabalhismo-cristao": "Laborismo cristiano",
    "social-democracia": "Socialdemocracia",
    "ecossocialismo": "Ecosocialismo",
    "ecologia-profunda": "Ecología profunda",
    "anarquismo-cristao": "Anarquismo cristiano",
    "libertarianismo-hoppeano": "Libertarismo hoppeano",
    "ecocapitalismo": "Ecocapitalismo",
    "ecoconservadorismo": "Ecoconservadurismo",
    "econacionalismo": "Econacionalismo",
    "criptoanarquismo": "Criptoanarquismo",
    "positivismo": "Positivismo",
    "progressismo-cristao": "Progresismo cristiano",
    "desenvolvimentismo-de-estado": "Desarrollismo estatal",
    "progressismo-de-direita": "Progresismo de derecha",
    "ecofascismo": "Ecofascismo",
    "teocratismo-cristao": "Teocratismo cristiano",
    "socialismo-titoista": "Socialismo titoísta",
    "conservadorismo-americano": "Conservadurismo estadounidense",
    "liberalismo-jacobino": "Liberalismo jacobino",
    "militarismo-libertario": "Militarismo libertario",
    "zapatismo": "Zapatismo",
    "aristocratismo-nietzschiano": "Aristocratismo nietzscheano",
    "democracia-ateniense": "Democracia ateniense",
    "social-democracia-nordica": "Socialdemocracia nórdica",
    "tecnocracia-liberal": "Tecnocracia liberal",
    "agrarianismo": "Agrarismo",
    "neotomismo": "Neotomismo",
    "ambientalismo-malthusiano": "Ambientalismo malthusiano",
    "anarquismo-egoista": "Anarquismo egoísta",
    "social-desenvolvimentismo": "Desarrollismo social",
    "socialismo-africano": "Socialismo africano",
    "anarquismo-kropotkiniano": "Anarquismo kropotkiniano",
    "anarcoprimitivismo": "Anarcoprimitivismo",
    "confucionismo": "Confucianismo",
    "atlantismo": "Atlantismo",
    "conservadorismo-reaganista": "Conservadurismo reaganista",
    "socialismo-strasserista": "Socialismo strasserista",
    "feminismo-libertario": "Feminismo libertario",
    "anarcopacifismo": "Anarcopacifismo",
    "anarcodistributismo": "Anarcodistributismo",
    "anarcocomunismo": "Anarcocomunismo",
    "anarco-progressismo": "Anarco-progresismo",
    "anarcossindicalismo": "Anarcosindicalismo",
    "anarco-naturalismo": "Anarconaturalismo",
    "socialismo-lassalliano": "Socialismo lassalliano",
    "estoicismo": "Estoicismo",
    "imperialismo-pluralista": "Imperialismo pluralista",
    "tecno-fascismo": "Tecnofascismo",
    "tecno-monarquismo": "Tecnomonarquismo",
    "tecno-socialismo": "Tecnosocialismo",
    "nacional-sindicalismo": "Nacionalsindicalismo",
    "anarquismo-agrario": "Anarquismo agrario",
    "democracia-securitaria": "Democracia securitaria",
}
for item in ideologies:
    if item["id"] in ideology_names:
        item["name"] = ideology_names[item["id"]]

ideology_field_fixes = {
    "paleoconservadorismo": {
        "description": "Derecha tradicionalista estadounidense, representada por Buchanan y Kirk, que defiende la herencia cristiana, el localismo y los derechos de los estados, restringe la inmigración y favorece el proteccionismo y el no intervencionismo frente a los neoconservadores y al Estado gerencial."
    },
    "republicanismo-confederal": {
        "description": "Tradición de repúblicas formadas por provincias o cantones soberanos, como la República Holandesa y la antigua Confederación Suiza, con autogobierno local, comercio abierto, neutralidad armada y una arraigada fe protestante."
    },
    "socialismo-federalista": {
        "phrase": "Quiero una unión de repúblicas socialistas con lenguas y culturas propias, guiada por el partido de vanguardia y por un plan económico común."
    },
    "centrismo-liberal": {
        "description": "Rama centrista favorable al mercado que combina responsabilidad fiscal, democracia liberal, apertura internacional moderada y reforma institucional, rechazando tanto el estatismo amplio como el radicalismo libertario como programa político."
    },
    "reacionarismo": {
        "name": "Reaccionarismo",
        "description": "Postura que rechaza la modernidad y busca restaurar el orden prerrevolucionario, defendiendo la monarquía, la religión, la tradición y la jerarquía frente al racionalismo de la Ilustración, el liberalismo y la democracia."
    },
    "reaccionarismo": {
        "name": "Reaccionarismo",
        "description": "Postura que rechaza la modernidad y busca restaurar el orden prerrevolucionario, defendiendo la monarquía, la religión, la tradición y la jerarquía frente al racionalismo de la Ilustración, el liberalismo y la democracia."
    },
    "tecnocracia-de-direita": {
        "description": "Modelo que confía la gestión del Estado y la economía a expertos y a la eficiencia tecnológica, combinando mercados e innovación con decisiones técnicas en lugar de la deliberación política y la competencia partidista tradicional."
    },
    "socialismo-vietnamita": {
        "description": "Modelo del Partido Comunista de Vietnam que une el pensamiento de Ho Chi Minh, la liberación nacional anticolonial y la Đổi Mới de 1986: gobierno de partido único, economía de mercado orientada al socialismo, sector estatal dominante y apertura al comercio mundial."
    },
    "democracia-securitaria": {
        "description": "Doctrina de la democracia militante que permite a un Estado democrático restringir a sus enemigos, prohibir partidos antisistema, vigilar a los extremistas y mantener el servicio militar y las medidas de seguridad para defender el orden constitucional."
    },
    "imperialismo-pluralista": {
        "description": "Orden imperial autocrático y militarizado que expande el territorio por conquista, gobierna a los pueblos conquistados mediante autonomía comunal, administra la tolerancia religiosa y cobra tributos sin exigir la asimilación cultural de sus súbditos."
    },
    "socialismo-lassalliano": {
        "description": "Corriente socialista que busca emancipar a los trabajadores mediante el Estado nacional, con sufragio universal, cooperativas productoras financiadas con dinero público y un rechazo explícito de la vía revolucionaria."
    },
    "estoicismo": {
        "description": "Filosofía grecorromana que enseña a vivir según la razón y la naturaleza, aceptar con serenidad lo que está fuera de nuestro control y cultivar el deber, el autodominio y la virtud por encima del placer, reconociendo una ley natural común a toda la humanidad racional."
    },
    "teocracia-budista": {
        "description": "Gobierno de una jerarquía monástica budista, cuyos líderes y monasterios reencarnados dominan la política y la tierra, con el orden tradicional y los preceptos morales como ley, como en el Tíbet del Dalai Lama antes de 1950."
    },
    "confucionismo": {
        "description": "Doctrina que fundamenta el orden político en la virtud del gobernante, la jerarquía ritual y la piedad filial, y favorece el mérito burocrático y la educación moral por encima de la ley coercitiva o la participación popular."
    },
    "atlantismo": {
        "description": "Doctrina geopolítica de la alianza entre Estados Unidos, Canadá y Europa en torno a la OTAN y la UE, que respalda la expansión hacia el este y el uso del poder militar occidental para difundir la democracia liberal y los mercados libres frente a Rusia y China."
    },
    "conservadorismo-reaganista": {
        "description": "Corriente conservadora estadounidense asociada a Ronald Reagan. Combina impuestos más bajos y un papel económico federal más pequeño con la libre empresa, los valores religiosos tradicionales, el anticomunismo y una defensa militar firme."
    },
    "socialismo-strasserista": {
        "description": "Ala anticapitalista del nacionalsocialismo, vinculada a Gregor Strasser, que defendió un socialismo nacionalista de masas, la nacionalización y una revolución social dentro del movimiento, antes de ser aplastada por Hitler."
    },
    "feminismo-libertario": {
        "description": "Corriente que persigue la igualdad de género mediante la libertad individual y el mercado en lugar del Estado, defendiendo la autonomía, la igualdad de derechos y el fin de las restricciones legales a las decisiones de las mujeres."
    },
    "anarcopacifismo": {
        "description": "Rama anarquista que rechaza el Estado y toda violencia, y defiende la transformación social por medios no violentos, la desobediencia civil y la cooperación voluntaria como camino hacia una sociedad libre y justa."
    },
    "anarcodistributismo": {
        "description": "Síntesis del anarquismo y el distributismo que defiende una amplia distribución de la propiedad y la producción a pequeña escala, con comunidades autónomas y cooperativas organizadas sin monopolios estatales ni grandes empresas."
    },
    "anarcocomunismo": {
        "description": "Corriente que une el anarquismo y el comunismo, proponiendo una sociedad sin propiedad estatal ni privada, con producción y distribución colectivas según las necesidades, basada en la libre asociación y la ayuda mutua."
    },
    "anarco-progressismo": {
        "description": "Síntesis de corrientes anarquistas centrada en la liberación del cuerpo y la identidad, que une la crítica del patriarcado y de las normas de género y sexualidad con una apertura a la tecnología como herramienta de emancipación, rechazando el Estado, el capitalismo y toda jerarquía impuesta."
    },
    "anarcossindicalismo": {
        "description": "Corriente que ve los sindicatos revolucionarios como la base para derrocar el capitalismo mediante la acción directa y la huelga general, organizando la producción por los propios trabajadores en una sociedad libre y sin Estado."
    },
    "anarco-naturalismo": {
        "description": "Rama anarquista vinculada al naturismo que defiende una vida sencilla en contacto con la naturaleza, sin Estado ni convenciones opresivas, y valora la autonomía individual, la salud y la armonía con el mundo natural."
    },
    "centrismo-radical": {
        "description": "Centrismo llevado al extremo: evita tomar partido y busca una equidistancia exacta entre cada polo, desde la economía hasta la moralidad, tratando cada eje político como un punto de equilibrio que debe preservarse."
    },
    "arqueofuturismo": {
        "description": "Doctrina acuñada por Guillaume Faye que fusiona valores arcaicos, jerárquicos y tradicionalistas —identidad étnica, espiritualidad y ética guerrera— con una adhesión sin reservas a la tecnología avanzada, y sostiene que un colapso civil obligará a la humanidad a combinar el orden tribal con la ciencia hipermoderna."
    },
    "zapatismo": {
        "description": "Movimiento neozapatista surgido en 1994 en el sur de México, que combina autonomía indígena, democracia directa mediante asambleas y caracoles, economía cooperativa de subsistencia y rechazo a la toma del poder estatal, bajo el principio de mandar obedeciendo."
    },
    "democracia-islamica": {
        "description": "Corriente que busca conciliar el islam con la democracia electoral mediante partidos religiosos conservadores que gobiernan tras ganar elecciones, apoyan una economía de mercado y defienden valores musulmanes en la vida pública, como el AKP turco y Ennahda de Túnez."
    },
    "nacionalismo-budista": {
        "description": "Identidad étnica unida a la fe budista theravada, que ve a la nación como guardiana del Dharma amenazado por las minorías, como en el nacionalismo cingalés de Sri Lanka y en los movimientos monásticos Ma Ba Tha y 969 de Myanmar."
    },
    "sionismo": {
        "description": "Movimiento nacional judío fundado por Theodor Herzl en 1897, que buscaba un Estado judío en la Tierra de Israel como respuesta al antisemitismo y condujo a la creación de Israel en 1948, uniendo nación y lengua hebrea con el retorno a la tierra ancestral."
    },
    "socialismo-blanquista": {
        "description": "Doctrina de Auguste Blanqui según la cual una minoría revolucionaria conspiradora debe tomar el poder y gobernar mediante una dictadura provisional que expropie a la burguesía, con ateísmo militante y desconfianza hacia las elecciones y la acción de masas espontánea."
    },
    "teocratismo-islamico": {
        "description": "Doctrina que entrega el Estado al clero islámico y convierte la sharia en ley suprema por encima de la soberanía popular, como en la tutela del jurista de Jomeini (velayat-e faqih) en Irán y en el emirato talibán de Afganistán."
    },
    "tecno-fascismo": {
        "description": "Distopía que combina el autoritarismo totalitario del fascismo con vigilancia digital, inteligencia artificial y control tecnológico de las masas, utilizando la técnica para reprimir, manipular y dominar toda la sociedad."
    },
    "tecno-monarquismo": {
        "description": "Corriente que une la monarquía con la tecnología y la gestión eficiente, proponiendo un soberano que gobierna como un ejecutivo, apoyado en datos e innovación para proporcionar estabilidad estatal y dirección a largo plazo."
    },
    "tecno-socialismo": {
        "description": "Corriente que une la dictadura del proletariado con el aceleracionismo tecnológico, defendiendo un partido revolucionario, planificación basada en datos, automatización y propiedad colectiva para dirigir la transición al comunismo."
    },
    "anarquismo-cristao": {
        "description": "Corriente que une la fe cristiana con el anarquismo y sostiene que el Evangelio predica un amor, una igualdad y una no violencia incompatibles con el Estado, defendiendo comunidades libres basadas en la conciencia y la caridad."
    },
    "democracia-ateniense": {
        "description": "Ideología de la polis clásica que defiende la soberanía popular directa mediante la asamblea y la igualdad entre ciudadanos, pero reserva la ciudadanía a una minoría hereditaria y excluye a mujeres, extranjeros y esclavos."
    },
    "tecnocracia": {
        "description": "Modelo de gobierno en el que las decisiones las toman expertos conforme a criterios técnicos y científicos, confiando a ingenieros, economistas y científicos la gestión racional y eficiente del Estado y la economía."
    },
    "minarquismo": {
        "description": "Rama libertaria que defiende un Estado mínimo limitado a la policía, los tribunales y la defensa, dejando todo lo demás al mercado y a la iniciativa privada para proteger los derechos individuales sin oprimir la libertad."
    },
    "libertarianismo-bleeding-heart": {
        "name": "Libertarismo compasivo",
        "description": "Corriente que une los mercados libres y las libertades individuales con la preocupación por la justicia social, sosteniendo que la libertad económica también debe mejorar concretamente la vida de las personas más pobres y vulnerables."
    },
    "liberalismo-new-deal": {
        "description": "Corriente del Partido Demócrata nacida con Franklin Roosevelt que combina regulación financiera, seguridad social, obras públicas y sindicatos fuertes con patriotismo cívico, capitalismo preservado y liderazgo internacional."
    },
    "nacional-sindicalismo": {
        "name": "Nacionalsindicalismo",
        "description": "Corriente nacionalista y sindicalista que rechaza el liberalismo y el marxismo, defendiendo la unidad nacional, la organización corporativa del trabajo, la justicia social autoritaria y la movilización popular en todo el Estado."
    },
    "anarquismo-agrario": {
        "description": "Rama anarquista centrada en el campo que defiende comunidades rurales autónomas, propiedad colectiva de la tierra y cooperación campesina, rechazando la concentración estatal y de la tierra en favor de la autogestión."
    },
    "liberalismo-keynesiano": {
        "description": "Corriente inspirada por John Maynard Keynes que acepta los mercados y la democracia liberal, pero asigna al Estado la gestión de la demanda mediante gasto público contracíclico, con el pleno empleo como meta y una economía mixta."
    },
    "socialismo-africano": {
        "description": "Corriente de Sankara, Samora Machel, Nkrumah y Nyerere que une panafricanismo, conciencia negra, lucha anticolonial, colectivización agraria y autosuficiencia frente al neocolonialismo y el racismo."
    },
    "fascismo": {
        "description": "Doctrina ultranacionalista de renacimiento nacional que rechaza el liberalismo y el marxismo, exalta el Estado totalitario, la violencia regeneradora y el culto al líder, y trata a la nación como una religión secular, con variantes más allá del régimen italiano que le dio nombre."
    },
    "neoliberalismo": {"name": "Neoliberalismo"},
    "liberalismo-classico": {
        "description": "Rama original del liberalismo que defiende los derechos naturales, la propiedad, los mercados libres y un Estado mínimo, considerando la libertad individual y la estricta limitación del poder como fundamentos de una sociedad justa."
    },
    "geolibertarianismo": {
        "description": "Síntesis del libertarismo y el georgismo que combina mercados libres y libertades individuales con la tributación del valor de la tierra, considerada un recurso común, para financiar un Estado mínimo sin gravar el trabajo."
    },
    "indigenismo": {
        "description": "Corriente que valora a los pueblos indígenas y sus derechos, defendiendo la autonomía, el territorio, la cultura y la participación política, junto con modelos de desarrollo y un Estado plurinacional que respete sus tradiciones."
    },
    "minarco-mutualismo": {
        "name": "Mutualismo minárquico",
        "description": "Síntesis que une el mutualismo con un Estado mínimo, combinando el intercambio justo, las cooperativas y el crédito libre con una estructura pública reducida a las funciones esenciales de protección de derechos, contratos y libertades."
    },
    "anarcocapitalismo": {
        "name": "Anarcocapitalismo"
    },
    "conservadorismo-libertario": {
        "description": "Síntesis que une mercados libres y un Estado mínimo con la defensa de la tradición, la familia y el orden, valorando la libertad individual y la responsabilidad personal junto con la preservación de costumbres e instituciones."
    },
    "anarcoconservadorismo": {
        "name": "Anarcoconservadurismo",
        "description": "Corriente que rechaza el Estado pero conserva la tradición, la religión y los valores comunitarios, defendiendo un orden social espontáneo basado en las costumbres, la familia y la autoridad natural en lugar de un poder político central."
    },
    "tecno-comunismo": {
        "name": "Tecnocomunismo"
    },
    "tecno-anarquismo": {
        "name": "Tecnoanarquismo",
        "description": "Anarquismo tecnológico que propone abolir el Estado mediante automatización, energía abundante, redes descentralizadas y comunidades voluntarias autogestionadas con herramientas digitales y producción local libre."
    },
    "liberalismo-progressista": {
        "description": "Corriente que une el capitalismo de mercado y el comercio globalizado con un Estado de bienestar robusto, promoviendo la moral progresista, el laicismo y las instituciones democráticas, siguiendo el modelo social nórdico."
    },
    "militarismo-libertario": {
        "description": "Doctrina que combina un Estado mínimo en tributación, regulación y moral con fuerzas armadas fuertes y una ciudadanía armada: la defensa nacional es la única función estatal ampliada, tratada como condición de la libertad civil."
    },
    "liberal-desenvolvimentismo": {
        "description": "Modelo de los tigres de Asia Oriental —Singapur, Corea del Sur, Taiwán y Hong Kong— que considera los mercados libres, el comercio exterior y la empresa privada motores del crecimiento, junto con un Estado tecnocrático activo que planifica infraestructura, educación e industrialización estratégica, lejos del proteccionismo cerrado y del autoritarismo rígido."
    },
    "social-democracia-nordica": {
        "description": "Modelo escandinavo que combina la negociación colectiva tripartita entre sindicatos, empleadores y Estado, un Estado de bienestar universal financiado por altos impuestos y una economía de mercado abierta e impulsada por las exportaciones, con fuerte consenso social y baja desigualdad."
    },
    "tecno-comercialismo": {
        "name": "Tecnocomercialismo",
        "description": "Corriente neorreaccionaria que rechaza la democracia en favor de microEstados gestionados como empresas. Favorece la competencia entre jurisdicciones, los mercados libres, el derecho de salida y la innovación tecnológica como principios de gobierno."
    },
    "terceira-via": {
        "name": "Tercera vía",
        "description": "Renovación del centroizquierda bajo Blair, Clinton y Giddens que acepta los mercados globalizados y la disciplina fiscal, sustituye el bienestar pasivo por la activación laboral, es severa con el crimen y respalda las intervenciones liberales."
    },
    "social-democracia-brasileira": {
        "description": "Corriente del PSDB de Brasil, fundado en 1988 por Covas, Montoro y Cardoso, que combina una economía de mercado, un Estado social, la reforma estatal y la responsabilidad fiscal con el parlamentarismo y la moderación en temas sociales."
    },
    "nacionalismo-varguista": {
        "name": "Nacionalismo varguista",
        "description": "Doctrina del Estado Novo de Getúlio Vargas que une nacionalismo económico, un Estado centralizado, sindicatos estatales, leyes laborales y empresas públicas como Petrobras, en oposición a las oligarquías regionales y al liberalismo."
    },
    "nacionalismo-kemalista": {
        "description": "Doctrina de Mustafa Kemal Atatürk que fundó la Turquía moderna sobre seis flechas: republicanismo, nacionalismo, populismo, estatismo, laicismo y reformismo, imponiendo la occidentalización y el control estatal de la religión desde arriba."
    },
    "liberalismo-islamico": {
        "description": "Corriente reformista que reinterpreta el islam a la luz de la razón, los derechos humanos y el pluralismo, promoviendo la democracia, la igualdad de género, un Estado laico y la libertad de conciencia, en la tradición modernista de Muhammad Abduh."
    },
    "sionismo-trabalhista": {
        "description": "Vertiente socialista del sionismo que construyó el Estado de Israel mediante los kibutzim, la federación laboral Histadrut y el partido Mapai de Ben-Gurion, uniendo el nacionalismo judío, el trabajo colectivo de la tierra y un Estado de bienestar secular."
    },
    "socialismo-budista": {
        "description": "Corriente que fundamenta el socialismo en la ética budista, considera la compasión y el fin del apego bases de la igualdad, la propiedad común y el rechazo de las castas, desde Ambedkar y el Dalai Lama hasta el socialismo birmano de Ne Win."
    },
    "democracia-crista": {
        "description": "Corriente centrista que aplica valores cristianos a la política democrática, defendiendo la economía social de mercado, la familia, la solidaridad y el bien común como fundamentos de instituciones libres y pluralistas."
    },
    "conservadorismo-cristao": {
        "description": "Corriente que fundamenta la política en la moral cristiana y la tradición, defendiendo la familia, la vida y los valores religiosos dentro de la democracia, con énfasis en preservar las costumbres y el patrimonio cultural del pueblo."
    },
}
for item in ideologies:
    item.update(ideology_field_fixes.get(item["id"], {}))
(root / "es/ideologies.json").write_text(json.dumps(ideologies, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

question_fixes = {
    "estrutura_18": "No debería permitirse que una región se separe, incluso con el apoyo de su población local."
}
questions = json.loads((root / "es/questions.json").read_text(encoding="utf-8"))
for item in questions:
    if item["id"] in question_fixes:
        item["text"] = question_fixes[item["id"]]
(root / "es/questions.json").write_text(json.dumps(questions, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

country_names = {
    "atenas-democratica": "Atenas democrática",
    "reino-unido-vitoriano-imperio-britanico": "Imperio británico",
    "chile-de-pinochet": "Chile de Pinochet",
    "camboja-do-khmer-vermelho-pol-pot": "Camboya de los Jemeres Rojos (Pol Pot)",
    "argentina-peronista": "Argentina peronista",
    "espanha-franquista": "España franquista",
    "republica-holandesa": "República Holandesa (Provincias Unidas)",
    "republica-de-weimar": "República de Weimar",
    "comuna-de-paris": "Comuna de París",
    "florenca-renascentista": "Florencia renacentista",
    "chile-de-allende": "Chile de Allende",
    "imperio-russo-czarista": "Imperio ruso zarista",
    "genebra-calvinista": "Ginebra calvinista",
    "alemanha-oriental": "Alemania Oriental",
    "brasil-regime-militar": "Brasil bajo el régimen militar",
    "china-qing": "China de la dinastía Qing",
    "siria-de-assad": "Siria de Assad",
    "iraque-baathista": "Irak baazista",
    "reino-da-franca": "Reino de Francia",
    "reino-da-hungria": "Reino de Hungría",
    "califado-abassida": "Califato abasí",
}
country_categories = {
    "estados-unidos": "República liberal federal",
    "africa-do-sul-do-apartheid": "Estado de segregación racial",
    "argentina": "República federal nacional-popular",
    "brasil-era-vargas": "Estado nacional-laborista",
    "irlanda": "República liberal multinacional",
    "taiwan": "República democrática y tecnológica",
    "gra-colombia": "República centralista y militarizada",
    "estados-papais": "Teocracia clerical territorial",
    "suica-zug": "Región criptofiscal",
    "porto-rico": "Territorio colonial no incorporado",
    "palestina": "Autoridad fragmentada bajo ocupación",
    "daguestao": "Región musulmana tutelada",
    "japao-tokugawa": "Shogunato feudal aislacionista",
}
countries = json.loads((root / "es/countries.json").read_text(encoding="utf-8"))
for item in countries:
    if item["id"] in country_names:
        item["name"] = country_names[item["id"]]
    if item["id"] in country_categories:
        item["category"] = country_categories[item["id"]]
country_field_fixes = {
    "imperio-macedonico": {"name": "Imperio macedonio"},
    "rodesia": {"description": "Tras declarar unilateralmente su independencia del Reino Unido en 1965, Rodesia mantuvo el poder en manos de una minoría blanca mediante un sufragio basado en la propiedad, sostuvo una economía agrícola y minera bajo sanciones internacionales y libró una larga guerra civil hasta la transición a Zimbabue."},
    "porto-rico": {"description": "Territorio estadounidense no incorporado del Caribe, Puerto Rico tiene ciudadanía estadounidense sin representación plena en el Congreso y mantiene un debate continuo entre la estadidad, la independencia y su situación actual, además de afrontar una crisis de deuda y una fuerte dependencia de los incentivos fiscales federales."},
    "butao": {"description": "Pequeño reino del Himalaya, Bután combina una monarquía constitucional budista, una fuerte protección de la cultura y la naturaleza tradicionales y la Felicidad Nacional Bruta como brújula de gobierno, con una apertura cautelosa al mundo exterior."},
    "esparta": {"name": "Esparta"},
    "imperio-macedonico": {
        "name": "Imperio macedonio",
        "category": "Monarquía militar conquistadora",
        "description": "Imperio formado por las conquistas de Filipo II y Alejandro Magno, que combinó la monarquía militar macedonia, la administración persa, la fundación de ciudades griegas y la fusión cultural helenística en territorios diversos."
    },
    "imperio-romano": {
        "description": "Vasto imperio de la Antigüedad. Roma unió el poder militar, la ley y la administración centralizada bajo el emperador, se expandió por tres continentes y dejó un legado de lenguas, leyes e instituciones que dio forma a la civilización occidental."
    },
    "coreia-do-sul-de-park-chung-hee": {
        "description": "Bajo Park Chung-hee, Corea del Sur combinó el gobierno militar autoritario, el anticomunismo rígido, la disciplina social y la planificación estatal orientada a la industrialización impulsada por las exportaciones, creando los principales chaebols y preparando el ascenso tecnológico del país."
    },
    "africa-do-sul-do-apartheid": {
        "name": "Sudáfrica bajo el apartheid",
        "description": "Régimen de segregación racial institucional, el apartheid sudafricano negó derechos a la mayoría negra y concentró el poder en la minoría blanca, mediante leyes de separación que provocaron una fuerte resistencia interna y sanciones internacionales."
    },
    "sacro-imperio-romano-germanico": {
        "name": "Sacro Imperio Romano Germánico",
        "description": "Federación de territorios centroeuropeos que reunió principados y ciudades bajo un emperador electo y una fuerte influencia de la Iglesia, con poder fragmentado y amplia autonomía de sus miembros."
    },
    "islandia-medieval": {
        "name": "Islandia medieval (Mancomunidad)",
        "description": "Sociedad poco habitual sin un Estado central. La Islandia medieval se organizaba alrededor de jefes locales y de una asamblea, el Althing, que resolvía controversias mediante leyes y acuerdos privados en un sistema descentralizado cercano a la anarquía."
    },
    "portugal-estado-novo": {
        "description": "Bajo Salazar, el Estado Novo portugués fue una dictadura conservadora y corporatista que combinó el nacionalismo católico, el orden y el control político sin movilización masiva, y mantuvo el país y sus colonias durante décadas."
    },
    "prussia": {
        "description": "Reino alemán con una fuerte tradición militar y administrativa. Prusia combinó una monarquía centralizada, una burocracia disciplinada y un poderoso ejército, lideró la unificación alemana y encarnó el Estado burocrático y el despotismo ilustrado."
    },
    "brasil-era-vargas": {
        "description": "Bajo Vargas, Brasil experimentó un régimen nacionalista de desarrollo que promovió la industrialización dirigida por el Estado, la legislación laboral y la centralización del poder, sentando las bases del desarrollo industrial brasileño."
    },
    "tchequia": {
        "name": "Chequia",
        "description": "República parlamentaria de Europa Central, Chequia combina una democracia liberal consolidada, una fuerte tradición secular, una economía industrializada de mercado y la integración en la Unión Europea tras el fin del bloque socialista."
    },
    "mexico-de-cardenas": {
        "description": "Gobierno del periodo cardenista, que marcó la institucionalización de la Revolución Mexicana mediante la nacionalización del petróleo, la reforma agraria ejidal, la incorporación de obreros y campesinos, el secularismo popular y un liderazgo presidencial fuerte."
    },
    "peru": {
        "description": "República presidencial unitaria marcada por una grave inestabilidad política y sucesivas destituciones presidenciales, con una economía abierta basada en la minería, una informalidad laboral generalizada y una profunda desigualdad entre la costa y las regiones andinas y amazónicas."
    },
    "turquia-de-ataturk": {
        "description": "República fundada por Mustafa Kemal Atatürk sobre las ruinas del Imperio otomano. La Turquía kemalista abolió el califato e impuso el laicismo, el alfabeto latino, los derechos de las mujeres y el estatismo económico bajo el partido único del CHP."
    },
    "daguestao": {
        "name": "Daguestán (Rusia)",
        "description": "República de la Federación Rusa en el Cáucaso Norte, Daguestán es multiétnica y de mayoría musulmana suní, con fuerte religiosidad sufí, clanes locales, dependencia de los subsidios de Moscú, represión del islamismo radical y poca autonomía real."
    },
    "senegal": {
        "description": "República de mayoría musulmana sufí del África occidental, Senegal es una democracia laica estable que, desde 2024 y bajo Bassirou Diomaye Faye y Ousmane Sonko, persigue un soberanismo de izquierdas: eliminó las tropas francesas y critica el franco CFA."
    },
    "nigeria": {
        "description": "País más poblado de África, Nigeria es una federación dividida entre un norte musulmán, con sharia en doce estados, y un sur cristiano. Depende del petróleo, sufre la violencia de Boko Haram y, bajo Bola Tinubu, eliminó los subsidios al combustible."
    },
    "china-qing": {
        "description": "Última dinastía imperial de China, fundada por los manchúes. La dinastía Qing gobernó mediante una burocracia basada en los exámenes confucianos, extendió el imperio al Tíbet y Xinjiang, restringió el comercio exterior a Cantón y declinó tras las guerras del Opio y la rebelión Taiping."
    },
    "grecia": {
        "description": "Democracia parlamentaria del sudeste europeo cuya Constitución reconoce a la Iglesia ortodoxa. Grecia superó la crisis de deuda bajo la austeridad impulsada por la UE, se rige por Nueva Democracia de Kyriakos Mitsotakis y legalizó el matrimonio entre personas del mismo sexo en 2024."
    },
    "tibete": {
        "description": "Estado independiente de facto entre la caída de la dinastía Qing y la invasión china. El Tíbet era una teocracia budista gobernada por el Dalai Lama, con monasterios y aristocracia propietarios de la tierra, campesinos vinculados a ella y un deliberado aislamiento del mundo moderno."
    },
    "coroa-de-aragao": {
        "description": "Unión dinástica de Aragón, Cataluña y otras tierras mediterráneas cuyos reinos constituyentes mantuvieron sus propias leyes y asambleas. La Corona se expandió mediante el comercio y la conquista; sus instituciones fueron abolidas gradualmente después de la Guerra de Sucesión Española."
    },
    "espanha-habsburgos": {
        "name": "España de los Habsburgo",
        "description": "España de los Habsburgo, especialmente bajo Felipe II, era un Estado católico de la Contrarreforma, marcado por la Inquisición, los estatutos de limpieza de sangre, las expulsiones religiosas y las guerras libradas en defensa de la fe."
    },
    "santa-catarina": {
        "description": "Estado del sur establecido por azorianos y otros inmigrantes europeos, Santa Catarina tiene un alto índice de desarrollo humano, una economía diversificada de pequeñas y medianas empresas y un electorado predominantemente conservador."
    },
    "reino-de-jerusalem": {
        "description": "Estado cruzado fundado después de la Primera Cruzada, el Reino de Jerusalén era una monarquía feudal latina y católica, respaldada por las órdenes militares templaria y hospitalaria, con poderosos barones, guerra santa constante y una élite franca sobre una mayoría nativa."
    },
    "rodesia": {"name": "Rodesia"},
    "japao-tokugawa": {"name": "Japón Tokugawa"},
    "indonesia": {
        "description": "El país musulmán más grande del mundo, Indonesia es una república presidencial democrática formada por un archipiélago, con una economía de mercado en expansión, una gran diversidad étnica y religiosa y un creciente peso regional en el sudeste asiático."
    }
}
for item in countries:
    item.update(country_field_fixes.get(item["id"], {}))
(root / "es/countries.json").write_text(json.dumps(countries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

role_terms = {
    "Statesman": "Estadista", "Philosopher": "Filósofo", "Politician": "Político", "Economist": "Economista",
    "Dictator": "Dictador", "Revolutionary": "Revolucionario", "Entrepreneur": "Emprendedor", "Writer": "Escritor",
    "Emperor": "Emperador", "Religious leader": "Líder religioso", "Thinker": "Pensador",
    "Political theorist": "Teórico político", "Activist": "Activista", "Military officer and statesman": "Oficial militar y estadista",
    "Monarch": "Monarca", "Statesman and philosopher": "Estadista y filósofo", "President of the United States": "Presidente de Estados Unidos",
    "Marxist theorist": "Teórico marxista", "Socialist theorist": "Teórico socialista", "Philosopher and economist": "Filósofo y economista",
    "Intellectual": "Intelectual", "Political philosopher": "Filósofo político", "Political leader": "Líder político",
    "Individualist anarchist": "Anarquista individualista", "Cryptographer": "Criptógrafo", "Jurist": "Jurista", "Journalist": "Periodista",
    "Military leader": "Líder militar", "Statesman and military leader": "Estadista y líder militar", "Protestant reformer": "Reformador protestante",
    "Roman emperor": "Emperador romano", "Communist leader": "Líder comunista", "General Secretary of the Chinese Communist Party": "Secretario general del Partido Comunista Chino",
    "Theoretical physicist": "Físico teórico", "Emperor of Japan": "Emperador de Japón", "President of Argentina": "Presidente de Argentina",
    "Former Chancellor of Germany": "Ex canciller de Alemania", "Ecologist": "Ecologista", "Political strategist": "Estratega político",
    "Bioethicist": "Bioeticista", "Economist and statesman": "Economista y estadista", "Journalist and essayist": "Periodista y ensayista",
    "Political economist": "Economista político", "Socialist philosopher": "Filósofo socialista", "Enlightenment philosopher": "Filósofo de la Ilustración",
    "Conservationist": "Conservacionista", "Inventor and futurist": "Inventor y futurista", "Anarchist theorist": "Teórico anarquista",
    "Theorist": "Teórico", "Linguist and thinker": "Lingüista y pensador", "Anarchist": "Anarquista", "Libertarian socialist": "Socialista libertario",
    "Objectivist philosopher": "Filósofo objetivista", "Libertarian theorist": "Teórico libertario", "Statesman and economist": "Estadista y economista",
    "Essayist": "Ensayista", "Christian activist": "Activista cristiano", "Theologian": "Teólogo", "Diplomat": "Diplomático", "Poet": "Poeta",
    "Jurist and reformer": "Jurista y reformador", "Psychiatrist and theorist": "Psiquiatra y teórico", "Objectivist psychologist": "Psicólogo objetivista",
    "Sociologist and statesman": "Sociólogo y estadista", "Entrepreneur and activist": "Emprendedor y activista", "Statesman and scientist": "Estadista y científico",
    "King and conqueror": "Rey y conquistador", "Psychologist and essayist": "Psicólogo y ensayista", "Philosopher and statesman": "Filósofo y estadista",
    "Philosopher and diplomat": "Filósofo y diplomático", "Creator of Bitcoin": "Creador de Bitcoin", "Investor and philanthropist": "Inversor y filántropo",
    "Entrepreneur and philanthropist": "Emprendedor y filántropo", "Radical ecologist": "Ecologista radical", "Pope and monarch of the Papal States": "Papa y monarca de los Estados Pontificios",
    "Byzantine emperor": "Emperador bizantino", "King of Spain and global emperor": "Rey de España y emperador global", "Tsar of Russia": "Zar de Rusia",
    "King of Portugal": "Rey de Portugal", "Founder of the Mongol Empire": "Fundador del Imperio mongol",
    "Philosopher and New Right activist": "Filósofo y activista de la Nueva Derecha",
    "Statesman and naturalist": "Estadista y naturalista", "Maroon leader": "Líder cimarrón", "Tsar": "Zar",
    "U.S. Secretary of State": "Secretario de Estado de Estados Unidos", "Programmer": "Programador", "Engineer": "Ingeniero",
    "Pastor and civil rights leader": "Pastor y líder de los derechos civiles", "Propaganda Minister": "Ministro de Propaganda",
    "Industrialist": "Industrialista", "Industrialist and state executive": "Industrialista y ejecutivo estatal",
    "Leader of the Dutch Revolt": "Líder de la revuelta neerlandesa", "Inventor and businessman": "Inventor y empresario",
    "Diplomat and foreign Minister": "Diplomático y ministro de Asuntos Exteriores",
    "Athenian stateman": "Estadista ateniense",
}
role_repairs = {
    "Politicano": "Político", "Filosofía": "Filósofo", "Economist": "Economista", "Dictator": "Dictador",
    "Teorería política": "Teoría política", "Filosofía y economista": "Filósofo y economista", "Teorista socialista": "Teórico socialista",
    "Statesman y filósofo": "Estadista y filósofo", "Political leader": "Líder político", "Cryptographer": "Criptógrafo",
    "Military leader": "Líder militar", "Estado y líder militar": "Estadista y líder militar", "Teorista": "Teórico",
    "Iluminación filósofo": "Filósofo de la Ilustración", "Conservación": "Conservacionista", "Emprendimiento y activista": "Emprendedor y activista",
    "Statesman and scientific": "Estadista y científico", "Filosofo y diplomático": "Filósofo y diplomático", "Emprendimiento y filantropista": "Emprendedor y filántropo",
    "Teorista libertario": "Teórico libertario", "Teorista anarco-sindicalista": "Teórico anarcosindicalista",
    "Filosofía y estadista": "Filósofo y estadista", "Sociologista": "Sociólogo",
    "Sociologista y estadista": "Sociólogo y estadista", "Archduke y heredero aparente": "Archiduque y heredero aparente",
    "militante anarquista y teórico": "Militante anarquista y teórico", "economista y político Fabian": "Economista y político fabiano",
    "Marshal y estadista": "Mariscal y estadista", "Guerrilla líder y estadista": "Líder guerrillero y estadista",
    "Física y Matemática": "Físico y matemático", "Filosofía y Matemática": "Filósofo y matemático",
    "Federal Deputy": "Diputado federal",
    "Emprendimiento y político": "Empresario y político",
    "Fisicista y astrónomo": "Físico y astrónomo", "Líder teólogo y revolucionario": "Líder teológico y revolucionario",
    "Santo Emperador Romano y Rey de España": "Emperador del Sacro Imperio Romano Germánico y rey de España",
    "Comentador y académico": "Comentarista y académico", "Jefe de estado": "Jefe de Estado",
    "Gran Mufti y reformador islámico": "Gran muftí y reformador islámico",
    "filósofo andaluz y jurista": "Filósofo andalusí y jurista",
    "Jefe rabino y teólogo": "Gran rabino y teólogo", "Policia y activista": "Político y activista",
    "Jurista y justicia suprema": "Jurista y magistrado del Supremo Tribunal Federal",
    "Ex juez y político": "Exjuez y político", "Emprendimiento y político": "Empresario y político",
    "Navegador y explorador británico": "Navegante y explorador británico",
    "Comentarios políticos y streamer": "Comentarista político y streamer",
}
personalities = json.loads((root / "es/personalities.json").read_text(encoding="utf-8"))
for item in personalities:
    item["role"] = role_terms.get(item.get("role"), role_repairs.get(item.get("role"), item.get("role")))
personality_field_fixes = {
    "frederico-ii-da-prussia": {
        "name": "Federico el Grande",
        "description": "Rey de Prusia, Federico el Grande convirtió el reino en una potencia militar y administrativa, encarnando el despotismo ilustrado mediante una burocracia disciplinada, finanzas centralizadas y tolerancia religiosa."
    },
    "alexandre-o-grande": {
        "name": "Alejandro Magno",
        "description": "Rey de Macedonia y conquistador de Persia, Alejandro combinó la monarquía militar, la expansión imperial, la fundación de ciudades y la integración de las élites griega, macedonia y oriental después de derrotar a los aqueménidas."
    },
    "dom-pedro-i": {
        "name": "Pedro I de Brasil",
        "description": "Primer emperador de Brasil, Pedro I lideró la independencia y estableció una monarquía constitucional centralizada, conciliando el liberalismo dinástico, la autoridad personal, la unidad territorial y la defensa del orden imperial."
    },
    "dom-pedro-ii": {
        "name": "Pedro II de Brasil",
        "description": "Segundo emperador de Brasil, Pedro II gobernó como monarca constitucional, valorando el parlamentarismo, la estabilidad institucional, la ciencia, la educación y la abolición gradual de la esclavitud, y preservando la unidad nacional mediante el poder moderador."
    },
    "filipe-ii-da-espanha": {"name": "Felipe II de España"},
    "pedro-o-grande": {
        "name": "Pedro el Grande",
        "role": "Zar de Rusia",
        "description": "Zar de Rusia de 1682 a 1725, Pedro I modernizó por la fuerza el Imperio ruso, europeizó a la nobleza, creó una armada y subordinó la Iglesia ortodoxa al Estado."
    },
    "dom-manuel-i": {
        "name": "Manuel I de Portugal",
        "description": "Manuel I reinó durante el apogeo de la expansión marítima portuguesa, cuando Vasco da Gama llegó a la India y Cabral a Brasil, y centralizó el comercio de especias a través de la Casa da India."
    },
    "socrates": {
        "name": "Sócrates",
        "lifespan": "470–399 BC",
        "description": "El filósofo ateniense Sócrates creó el método dialéctico de cuestionamiento para examinar las creencias y perseguir la virtud; desconfiaba de la política de masas y de la retórica de los demagogos, y fue ejecutado por corromper a la juventud."
    },
    "paulo-de-tarso": {
        "name": "San Pablo (Pablo de Tarso)",
        "description": "Apóstol que llevó el cristianismo al mundo grecorromano, Pablo estableció la salvación por la gracia en lugar de la ley mosaica, renunció a la circuncisión para los gentiles y predicó la sumisión a la autoridad constituida."
    },
    "voltaire": {
        "role": "Filósofo y escritor de la Ilustración",
        "description": "Escritor y filósofo de la Ilustración francesa, atacó el fanatismo religioso y la Iglesia («aplastar a la infame»), defendió la libertad de expresión y la tolerancia en el caso de Calas, pero favoreció la monarquía ilustrada sobre la democracia popular. Deísta y autor de Cándido."
    },
    "fernando-iii-de-castela": {
        "name": "Fernando III de Castilla",
        "description": "Rey de Castilla desde 1217 y de León desde 1230, consolidó la unión de las coronas y conquistó Córdoba y Sevilla. Gobernó como monarca medieval católico y promovió la organización legal y administrativa de los territorios conquistados."
    },
    "imperador-jimmu": {
        "name": "Emperador Jimmu",
        "description": "Primer emperador legendario de Japón según el Kojiki y el Nihon Shoki, Jimmu, descendiente de la diosa solar Amaterasu, supuestamente conquistó Yamato por la fuerza de las armas y fundó la línea imperial, un mito central del Estado sintoísta y del nacionalismo japonés."
    },
    "oda-nobunaga": {
        "description": "Daimyo del período Sengoku, Nobunaga comenzó la unificación de Japón mediante el uso masivo de arcabuces, depuso al shogunato Ashikaga, masacró a los monjes guerreros de Enryaku-ji y del Ikkō-ikki, abolió gremios y peajes y toleró a los misioneros jesuitas."
    },
    "qin-shi-huang": {
        "description": "Rey de Qin que unificó China en 221 a. C. y se proclamó primer emperador; gobernó mediante el legalismo y leyes severas, reemplazó el feudalismo por comandancias centralizadas, estandarizó la escritura y la acuñación, quemó libros y comenzó la Gran Muralla."
    },
    "jose-ii-da-austria": {
        "name": "José II de Austria",
        "role": "Emperador del Sacro Imperio Romano Germánico",
        "description": "José II abolió la servidumbre personal, decretó la tolerancia religiosa, cerró cientos de monasterios e impuso el alemán en la administración; sus reformas provocaron revueltas en Bélgica y Hungría."
    },
    "alan-turing": {
        "description": "Matemático y lógico británico, descifró el código Enigma nazi en Bletchley Park y sentó las bases teóricas de la informática (máquina de Turing y test de Turing). Fue procesado por homosexualidad en 1952, castrado químicamente y murió en 1954; recibió un indulto póstumo en 2013."
    },
    "jose-antonio-kast": {
        "description": "Fundador del Partido Republicano de Chile y presidente desde marzo de 2026, es un católico conservador que ha elogiado abiertamente el legado de Pinochet. Se ha comprometido a expulsar a los migrantes irregulares, endurecer las penas, reducir el gasto y bajar los impuestos corporativos, y se opone al aborto."
    },
    "sergio-mattarella": {
        "description": "Presidente de Italia desde 2015 y reelegido en 2022, Mattarella procede de la democracia cristiana de izquierdas y defiende la Constitución, el europeísmo, la OTAN y el apoyo a Ucrania, frente a la mafia que asesinó a su hermano."
    },
    "balduino-iv": {
        "name": "Balduino IV",
        "description": "Rey cruzado de Jerusalén entre 1174 y 1185, Balduino IV gobernó pese a padecer lepra desde la infancia, derrotó a Saladino en Montgisard, defendió el reino latino por la fe y la espada y mantuvo treguas pragmáticas con los musulmanes."
    },
    "gamal-abdel-nasser": {
        "description": "Presidente de Egipto de 1956 a 1970, Nasser nacionalizó el canal de Suez y amplió la propiedad estatal y la reforma agraria. Promovió el panarabismo y la no alineación mientras concentraba el poder y reprimía a la oposición."
    },
    "ernst-junger": {
        "role": "Escritor y ensayista alemán",
        "description": "Veterano de la Primera Guerra Mundial y escritor revolucionario conservador, Jünger elogió la movilización tecnológica y criticó el liberalismo burgués en El trabajador (1932). Se negó a unirse al Partido Nazi y más tarde criticó el totalitarismo."
    },
    "saladino": {
        "name": "Saladino",
        "role": "Sultán de Egipto y Siria",
        "description": "Fundador de la dinastía ayubí, Saladino unió Egipto y Siria, derrotó a los cruzados en Hattin y recuperó Jerusalén en 1187, convirtiéndose en símbolo de la yihad contra las cruzadas y de una caballería reconocida incluso por sus enemigos."
    },
    "albert-camus": {
        "description": "Escritor franco-argelino y ganador del Nobel de 1957, Camus combatió en la Resistencia, rompió con Sartre al condenar los campos soviéticos en El hombre rebelde y defendió una Argelia plural frente al terrorismo de ambos bandos."
    },
    "olaf-scholz": {
        "description": "Canciller alemán y socialdemócrata de 2021 a 2025, Scholz proclamó el Zeitenwende, destinó 100 000 millones de euros a las fuerzas armadas y envió armas a Ucrania, elevó el salario mínimo a 12 euros y defendió el freno de la deuda hasta el colapso de la coalición semáforo."
    },
    "cristovao-colombo": {
        "name": "Cristóbal Colón",
        "role": "Navegante y gobernador colonial",
        "description": "Navegante genovés al servicio de los Reyes Católicos, llegó a América en 1492 buscando una ruta comercial hacia las Indias. Como gobernador colonial, esclavizó a indígenas para obtener oro y fue arrestado y enviado encadenado a España por abusos de poder."
    },
    "isaac-newton": {
        "role": "Físico y matemático",
        "description": "Físico y matemático inglés, Newton fundó la mecánica clásica y el cálculo infinitesimal en los Principia Mathematica. Dirigió la Royal Society con mano de hierro y, como director de la Casa de la Moneda, persiguió a falsificadores hasta la horca. También fue un alquimista secreto y antitrinitario."
    },
    "che-guevara": {
        "description": "Revolucionario argentino que lideró la guerra de guerrillas junto a Fidel Castro en Cuba y defendió la lucha armada y el internacionalismo revolucionario. Como ministro cubano, murió intentando exportar la revolución a Bolivia y se convirtió en un icono global de la izquierda radical."
    },
    "friedrich-engels": {
        "role": "Teórico revolucionario",
        "description": "Teórico revolucionario alemán, Engels coescribió el Manifiesto comunista y financió a Marx con los beneficios de la fábrica de su familia, relacionando la opresión de las mujeres y del Estado con la propiedad privada y estudiando la guerra como arte revolucionario."
    },
    "tony-blair": {
        "description": "Primer ministro británico de 1997 a 2007, Blair llevó al New Labour a la Tercera Vía, con mercados, inversión en educación y penas más severas; apoyó la invasión de Irak y ahora defiende la identidad digital y la inteligencia artificial en el Gobierno."
    },
    "carlos-lacerda": {
        "description": "Periodista y líder del partido UDN, Lacerda cambió el comunismo de su juventud por el anticomunismo liberal, ayudó a derrocar a Vargas y apoyó el golpe de 1964, gobernó Guanabara con grandes obras públicas y desalojos de favelas y después fundó el Frente Amplio."
    },
    "barao-do-rio-branco": {
        "name": "Barón de Río Branco",
        "description": "Ministro de Relaciones Exteriores de 1902 a 1912, el Barón de Río Branco resolvió las fronteras de Brasil mediante el arbitraje y la negociación, como en Acre y Misiones, acercó el país a Estados Unidos y convirtió el derecho y la diplomacia en la base de la política exterior."
    },
    "barao-de-maua": {
        "name": "Barón de Mauá",
        "description": "Industrialista y banquero del Imperio brasileño, Mauá fundó un astillero, una fundición, los primeros ferrocarriles y bancos de Brasil a orillas del Río de la Plata; crítico liberal de la esclavitud, chocó con la política crediticia restrictiva del Gobierno y quebró en 1875."
    },
    "guilherme-de-orange": {
        "name": "Guillermo de Orange",
        "description": "Noble luterano que se convirtió al catolicismo y luego al calvinismo, Guillermo dirigió la revuelta neerlandesa contra Felipe II de España, defendió una tolerancia religiosa relativa y fue asesinado en 1584 por un agente español, convirtiéndose en el «padre de la patria»."
    },
    "imperador-meiji": {"name": "Emperador Meiji"},
    "carlos-v": {"name": "Carlos V"},
    "rei-davi": {"name": "Rey David"},
    "nicolau-ii": {"name": "Nicolás II"},
    "papa-francisco": {"name": "Papa Francisco"},
    "papa-leao-xiv": {"name": "Papa León XIV"},
    "mussolini": {
        "description": "Creador del fascismo, Mussolini gobernó Italia como una dictadura totalitaria construida sobre el culto al líder y un Estado corporatista. Ateo y anticlerical en su juventud, convirtió a la Iglesia en aliada política mediante los Pactos de Letrán de 1929, más por conveniencia que por fe."
    },
    "engelbert-dollfuss": {
        "description": "Canciller austriaco, Dollfuss estableció el austrofascismo, un Estado corporatista autoritario de base católica que disolvió el parlamento y reprimió a socialistas y nazis hasta que fue asesinado por agentes nazis."
    },
    "jose-antonio-primo-de-rivera": {
        "description": "Fundador de la Falange Española, Primo de Rivera creó el nacionalsindicalismo y defendió un Estado corporatista, nacionalista y católico frente al liberalismo y el marxismo, convirtiéndose en mártir de la derecha franquista."
    },
    "richard-spencer": {
        "description": "Activista estadounidense, Spencer popularizó el término alt-right y defiende un nacionalismo blanco identitario y un Estado étnicamente homogéneo, posiciones supremacistas ampliamente repudiadas dentro y fuera de Estados Unidos."
    },
    "jabotinsky": {
        "description": "Líder del sionismo revisionista, Jabotinsky defendió un nacionalismo judío afirmativo, una fuerza militar independiente y un Estado de mayoría judía, convirtiéndose en una inspiración para la derecha israelí contemporánea."
    },
    "curtis-yarvin": {
        "description": "Teórico político conocido como Mencius Moldbug, Yarvin formuló la neorreacción y propuso reemplazar la democracia por un Estado dirigido como una empresa por un soberano ejecutivo, según el modelo del neocameralismo."
    },
    "friedrich-list": {
        "description": "Economista alemán, List promovió el nacionalismo económico y la protección de las industrias nacientes, argumentando que los países atrasados necesitan aranceles y un Estado fuerte para desarrollarse y alcanzar a las naciones ricas."
    },
    "theodor-herzl": {
        "description": "Herzl, periodista austrohúngaro, fue el fundador del sionismo político moderno y abogó por la creación de un Estado nacional judío como respuesta al antisemitismo, convirtiéndose en una figura central de la historia de Israel."
    },
    "fidel-castro": {
        "description": "Revolucionario cubano, Fidel Castro dirigió la revolución de 1959 y construyó un Estado socialista de partido único, antiimperialista y nacionalista, con una economía estatal y una fuerte represión."
    },
    "joe-biden": {
        "description": "Estadista estadounidense, Biden representa el centro democrático liberal y combina un Estado de bienestar moderado, alianzas internacionales, defensa institucional y avances progresistas graduales."
    },
    "pentti-linkola": {
        "description": "Pescador y pensador finlandés, Linkola defendió una ecología profunda antidemocrática y antitecnológica, con un Estado fuerte, el fin del crecimiento económico y una drástica reducción de la población para salvar la biosfera, convirtiéndose en una referencia del ecoautoritarismo."
    },
    "papa-pio-ix": {
        "name": "Papa Pío IX",
        "description": "Último Papa-Rey, Pío IX gobernó los Estados Pontificios hasta 1870, en el pontificado más largo de la historia; definió el dogma de la Inmaculada Concepción, proclamó la infalibilidad papal en el Vaticano I y condenó el liberalismo en el Syllabus de errores."
    },
    "jose-bonifacio": {
        "description": "Científico y estadista conocido como el «Patriarca de la Independencia», José Bonifácio fue el principal arquitecto político de la separación de Brasil de Portugal en 1822, y favoreció un Estado centralizado, la abolición gradual de la esclavitud y una nación unificada bajo una monarquía constitucional."
    },
    "errico-malatesta": {
        "description": "Comunista anarquista italiano, Malatesta pasó décadas en la clandestinidad y en el exilio organizando insurrecciones y periódicos obreros, abogando por la abolición del Estado y la propiedad privada mediante la acción directa, y rechazando tanto el parlamentarismo como la dictadura bolchevique."
    },
    "rui-costa-pimenta": {
        "role": "Periodista y político",
        "description": "Periodista que fundó el partido PCO de Brasil en 1995, Pimenta defiende la revolución proletaria, la nacionalización de los bancos, la privatización de empresas, la disolución de la policía antidisturbios y el derecho a la posesión de armas, combinando el radicalismo económico con la crítica a la política identitaria de la izquierda."
    },
    "samora-machel": {
        "role": "Líder guerrillero y estadista",
        "description": "Líder guerrillero y primer presidente de Mozambique tras la independencia de Portugal, Machel dirigió al FRELIMO hacia un Estado marxista-leninista de partido único, con colectivización agraria, apoyo soviético y oposición al colonialismo y al apartheid regional."
    },
    "celso-furtado": {
        "description": "Economista brasileño de la escuela de la CEPAL, Furtado explicó el subdesarrollo como resultado histórico de la división internacional del trabajo y defendió la industrialización planificada, la reforma agraria y un Estado desarrollista."
    },
    "bresser-pereira": {
        "description": "Economista brasileño y exministro de Finanzas, Bresser-Pereira formuló el nuevo desarrollismo, defendiendo un tipo de cambio competitivo, la industria nacional y un Estado reformado que impulse el crecimiento sin abandonar la democracia."
    },
    "papa-leao-xiii": {
        "name": "Papa León XIII",
        "description": "Papa de 1878 a 1903, León XIII fundó la doctrina social católica con la encíclica Rerum Novarum, defendiendo un salario justo, asociaciones obreras y la propiedad privada frente al socialismo y el liberalismo, y revitalizó el tomismo."
    },
    "felipe-vi": {
        "description": "Rey de España desde 2014, monarca constitucional con formación militar. En su discurso del 3 de octubre de 2017 condenó el referéndum separatista catalán para defender la unidad constitucional; renunció a la herencia de su padre y promueve la transparencia y el europeísmo."
    },
    "hafez-al-assad": {
        "description": "Presidente sirio de 1971 a 2000, Hafez al-Assad consolidó un Estado baazista militarizado y autoritario, combinando el socialismo árabe, el nacionalismo, el gobierno de partido único, el clientelismo y una diplomacia regional pragmática."
    },
    "muhammad-ali-jinnah": {
        "description": "Abogado y líder de la Liga Musulmana, Jinnah dirigió la creación de Pakistán en 1947 sobre la teoría de las dos naciones y fue su primer gobernador general, defendiendo un Estado de mayoría musulmana con libertad religiosa para las minorías."
    },
    "david-ben-gurion": {
        "description": "Líder del sionismo laborista y del partido Mapai, Ben-Gurion proclamó la independencia de Israel en 1948 y fue su primer ministro, construyendo un Estado secular y centralizado con un sector público fuerte, kibutzim y el ejército como escuela de la nación."
    },
    "imperador-meiji": {
        "description": "Emperador durante cuya restauración de 1868 Japón abolió el shogunato y la clase samurái, centralizó el Estado, se industrializó bajo el lema «país rico, ejército fuerte», adoptó la Constitución de 1889 y estableció un imperio moderno."
    },
    "marcelo-rebelo-de-sousa": {
        "description": "Profesor de Derecho, comentarista de televisión y exlíder del PSD, Marcelo fue presidente de Portugal de 2016 a 2026, con un estilo cálido y cercano al pueblo, un conservadurismo católico moderado, europeísmo y cooperación con los gobiernos de izquierda."
    },
    "rene-descartes": {
        "description": "Filósofo y matemático francés, padre de la filosofía moderna y creador de la geometría analítica, Descartes formuló la duda metódica y el dualismo mente-cuerpo («Pienso, luego existo»). Vivió en la tolerante República neerlandesa y evitó conflictos con la Iglesia después del caso Galileo."
    },
}
for item in personalities:
    item.update(personality_field_fixes.get(item["id"], {}))
(root / "es/personalities.json").write_text(json.dumps(personalities, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

phrase_repairs = {
    "secede": "se separe",
    "poliamory": "poliamor",
    "cauto apertura": "una apertura cautelosa",
    "aplastación de la revolución": "derrota de la revolución",
    "nacionalización de cobre y banco": "nacionalización del cobre y de la banca",
    "Sintesis": "Síntesis",
    " y igualitaria": " e igualitaria",
    "ver la compasión": "considera la compasión",
    "Regla por una jerarquía": "Gobernada por una jerarquía",
    "Gobierno gobernado por la Torá": "Gobierno regido por la Torá",
    "la derecha de la salida": "el derecho de salida",
    "la costura": "el tejido social",
    "estado magro": "Estado reducido",
}
for file_path in (root / "es").glob("*.json"):
    items = json.loads(file_path.read_text(encoding="utf-8"))
    changed = False
    for item in items:
        for key, value in list(item.items()):
            if not isinstance(value, str):
                continue
            repaired = value
            for source, target in phrase_repairs.items():
                repaired = repaired.replace(source, target)
            if repaired != value:
                item[key] = repaired
                changed = True
    if changed:
        file_path.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print("Normalized Spanish axes, spectrum terms, catalog names, roles, and reviewed high-visibility entries")
