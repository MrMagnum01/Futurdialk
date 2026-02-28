"""
Tawjih V4 — Database Seed Script
Populates schools, programs, scholarships, and roadmap templates.
Run: docker compose exec backend python -m seed
"""
import asyncio
import uuid
from app.core.database import engine, Base, AsyncSessionLocal
from app.models.school import School
from app.models.program import Program
from app.models.scholarship import Scholarship
from app.models.roadmap import RoadmapTemplate

# ── SCHOOLS ──────────────────────────────────────────────
SCHOOLS = [
    # France (10)
    {"name":"Université Paris-Saclay","short_name":"Paris-Saclay","country_code":"FR","city":"Gif-sur-Yvette","type":"university","is_public":True,"ranking_world":15,"tuition_international_yearly":"243 EUR","acceptance_rate":25,"has_moroccan_students":True,"application_platform":"campus_france","scholarship_available":True},
    {"name":"Sorbonne Université","short_name":"Sorbonne","country_code":"FR","city":"Paris","type":"university","is_public":True,"ranking_world":43,"tuition_international_yearly":"243 EUR","acceptance_rate":30,"has_moroccan_students":True,"application_platform":"campus_france","scholarship_available":True},
    {"name":"École Polytechnique","short_name":"X","country_code":"FR","city":"Palaiseau","type":"grande_ecole","is_public":True,"ranking_world":38,"tuition_international_yearly":"12 000 EUR","acceptance_rate":8,"has_moroccan_students":True,"application_platform":"campus_france","scholarship_available":True},
    {"name":"CentraleSupélec","short_name":"CS","country_code":"FR","city":"Gif-sur-Yvette","type":"grande_ecole","is_public":True,"ranking_world":116,"tuition_international_yearly":"3 770 EUR","acceptance_rate":12,"has_moroccan_students":True,"application_platform":"campus_france","scholarship_available":True},
    {"name":"ENSAM — Arts et Métiers","short_name":"ENSAM","country_code":"FR","city":"Paris","type":"grande_ecole","is_public":True,"ranking_world":None,"tuition_international_yearly":"601 EUR","acceptance_rate":15,"has_moroccan_students":True,"application_platform":"campus_france","scholarship_available":False},
    {"name":"Sciences Po Paris","short_name":"Sciences Po","country_code":"FR","city":"Paris","type":"grande_ecole","is_public":False,"ranking_world":2,"tuition_international_yearly":"14 500 EUR","acceptance_rate":10,"has_moroccan_students":True,"application_platform":"campus_france","scholarship_available":True},
    {"name":"Université de Strasbourg","short_name":"Unistra","country_code":"FR","city":"Strasbourg","type":"university","is_public":True,"ranking_world":87,"tuition_international_yearly":"243 EUR","acceptance_rate":35,"has_moroccan_students":True,"application_platform":"campus_france","scholarship_available":True},
    {"name":"INSA Lyon","short_name":"INSA","country_code":"FR","city":"Lyon","type":"grande_ecole","is_public":True,"ranking_world":None,"tuition_international_yearly":"601 EUR","acceptance_rate":18,"has_moroccan_students":True,"application_platform":"campus_france","scholarship_available":False},
    {"name":"Université Grenoble Alpes","short_name":"UGA","country_code":"FR","city":"Grenoble","type":"university","is_public":True,"ranking_world":96,"tuition_international_yearly":"243 EUR","acceptance_rate":32,"has_moroccan_students":True,"application_platform":"campus_france","scholarship_available":True},
    {"name":"HEC Paris","short_name":"HEC","country_code":"FR","city":"Jouy-en-Josas","type":"grande_ecole","is_public":False,"ranking_world":None,"tuition_international_yearly":"46 850 EUR","acceptance_rate":5,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    # Canada (5)
    {"name":"Université de Montréal","short_name":"UdeM","country_code":"CA","city":"Montréal","type":"university","is_public":True,"ranking_world":111,"tuition_international_yearly":"24 000 CAD","acceptance_rate":40,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"McGill University","short_name":"McGill","country_code":"CA","city":"Montréal","type":"university","is_public":True,"ranking_world":30,"tuition_international_yearly":"26 000 CAD","acceptance_rate":35,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"Université Laval","short_name":"ULaval","country_code":"CA","city":"Québec","type":"university","is_public":True,"ranking_world":181,"tuition_international_yearly":"20 000 CAD","acceptance_rate":50,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"University of Toronto","short_name":"UofT","country_code":"CA","city":"Toronto","type":"university","is_public":True,"ranking_world":21,"tuition_international_yearly":"58 000 CAD","acceptance_rate":25,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"Polytechnique Montréal","short_name":"PolyMTL","country_code":"CA","city":"Montréal","type":"grande_ecole","is_public":True,"ranking_world":None,"tuition_international_yearly":"22 000 CAD","acceptance_rate":30,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    # Germany (5)
    {"name":"Technische Universität München","short_name":"TUM","country_code":"DE","city":"Munich","type":"university","is_public":True,"ranking_world":37,"tuition_international_yearly":"258 EUR","acceptance_rate":20,"has_moroccan_students":True,"application_platform":"uni-assist","scholarship_available":True},
    {"name":"RWTH Aachen","short_name":"RWTH","country_code":"DE","city":"Aachen","type":"university","is_public":True,"ranking_world":87,"tuition_international_yearly":"258 EUR","acceptance_rate":25,"has_moroccan_students":True,"application_platform":"uni-assist","scholarship_available":True},
    {"name":"Freie Universität Berlin","short_name":"FU Berlin","country_code":"DE","city":"Berlin","type":"university","is_public":True,"ranking_world":73,"tuition_international_yearly":"312 EUR","acceptance_rate":30,"has_moroccan_students":True,"application_platform":"uni-assist","scholarship_available":True},
    {"name":"Universität Heidelberg","short_name":"Heidelberg","country_code":"DE","city":"Heidelberg","type":"university","is_public":True,"ranking_world":47,"tuition_international_yearly":"3 000 EUR","acceptance_rate":22,"has_moroccan_students":False,"application_platform":"uni-assist","scholarship_available":True},
    {"name":"KIT — Karlsruhe Institute of Technology","short_name":"KIT","country_code":"DE","city":"Karlsruhe","type":"university","is_public":True,"ranking_world":89,"tuition_international_yearly":"3 000 EUR","acceptance_rate":28,"has_moroccan_students":True,"application_platform":"uni-assist","scholarship_available":True},
    # UK (3)
    {"name":"University College London","short_name":"UCL","country_code":"UK","city":"London","type":"university","is_public":True,"ranking_world":9,"tuition_international_yearly":"26 200 GBP","acceptance_rate":20,"has_moroccan_students":True,"application_platform":"ucas","scholarship_available":True},
    {"name":"University of Edinburgh","short_name":"Edinburgh","country_code":"UK","city":"Edinburgh","type":"university","is_public":True,"ranking_world":22,"tuition_international_yearly":"24 600 GBP","acceptance_rate":30,"has_moroccan_students":True,"application_platform":"ucas","scholarship_available":True},
    {"name":"University of Manchester","short_name":"Manchester","country_code":"UK","city":"Manchester","type":"university","is_public":True,"ranking_world":32,"tuition_international_yearly":"23 000 GBP","acceptance_rate":35,"has_moroccan_students":True,"application_platform":"ucas","scholarship_available":True},
    # Spain (5)
    {"name":"Universitat de Barcelona","short_name":"UB","country_code":"ES","city":"Barcelona","type":"university","is_public":True,"ranking_world":81,"tuition_international_yearly":"2 500 EUR","acceptance_rate":40,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"Universidad Complutense de Madrid","short_name":"UCM","country_code":"ES","city":"Madrid","type":"university","is_public":True,"ranking_world":171,"tuition_international_yearly":"3 200 EUR","acceptance_rate":45,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":False},
    {"name":"Universidad de Granada","short_name":"UGR","country_code":"ES","city":"Granada","type":"university","is_public":True,"ranking_world":201,"tuition_international_yearly":"1 800 EUR","acceptance_rate":55,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"Universitat Politècnica de València","short_name":"UPV","country_code":"ES","city":"Valencia","type":"university","is_public":True,"ranking_world":259,"tuition_international_yearly":"2 200 EUR","acceptance_rate":40,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"Universidad de Salamanca","short_name":"USAL","country_code":"ES","city":"Salamanca","type":"university","is_public":True,"ranking_world":None,"tuition_international_yearly":"1 500 EUR","acceptance_rate":50,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":False},
    # Turkey (5)
    {"name":"Istanbul Technical University","short_name":"ITU","country_code":"TR","city":"Istanbul","type":"university","is_public":True,"ranking_world":301,"tuition_international_yearly":"4 000 TRY","acceptance_rate":20,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"Middle East Technical University","short_name":"METU","country_code":"TR","city":"Ankara","type":"university","is_public":True,"ranking_world":401,"tuition_international_yearly":"4 200 TRY","acceptance_rate":25,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"Boğaziçi University","short_name":"Bogazici","country_code":"TR","city":"Istanbul","type":"university","is_public":True,"ranking_world":481,"tuition_international_yearly":"3 500 TRY","acceptance_rate":15,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"Koç University","short_name":"Koc","country_code":"TR","city":"Istanbul","type":"university","is_public":False,"ranking_world":431,"tuition_international_yearly":"120 000 TRY","acceptance_rate":20,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    {"name":"Ankara University","short_name":"Ankara","country_code":"TR","city":"Ankara","type":"university","is_public":True,"ranking_world":501,"tuition_international_yearly":"3 000 TRY","acceptance_rate":35,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
    # Morocco (5)
    {"name":"Université Mohammed V de Rabat","short_name":"UM5","country_code":"MA","city":"Rabat","type":"university","is_public":True,"ranking_world":None,"tuition_international_yearly":"Free","acceptance_rate":70,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":False},
    {"name":"Université Hassan II de Casablanca","short_name":"UH2C","country_code":"MA","city":"Casablanca","type":"university","is_public":True,"ranking_world":None,"tuition_international_yearly":"Free","acceptance_rate":65,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":False},
    {"name":"École Mohammadia d'Ingénieurs","short_name":"EMI","country_code":"MA","city":"Rabat","type":"grande_ecole","is_public":True,"ranking_world":None,"tuition_international_yearly":"Free","acceptance_rate":10,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":False},
    {"name":"ENSA Marrakech","short_name":"ENSA","country_code":"MA","city":"Marrakech","type":"grande_ecole","is_public":True,"ranking_world":None,"tuition_international_yearly":"Free","acceptance_rate":12,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":False},
    {"name":"Al Akhawayn University","short_name":"AUI","country_code":"MA","city":"Ifrane","type":"university","is_public":False,"ranking_world":None,"tuition_international_yearly":"80 000 MAD","acceptance_rate":40,"has_moroccan_students":True,"application_platform":"direct","scholarship_available":True},
]

# Degree / field combos to distribute across schools
PROGRAM_TEMPLATES = [
    ("Licence Informatique","licence","engineering","fr",36),
    ("Master Computer Science","master","engineering","en",24),
    ("Licence Mathématiques","licence","sciences","fr",36),
    ("Master Data Science & AI","master","engineering","en",24),
    ("Diplôme d'Ingénieur","diplome_ingenieur","engineering","fr",60),
    ("Master Business Administration","mba","business","en",24),
    ("Licence Économie et Gestion","licence","business","fr",36),
    ("Master Finance","master","business","en",24),
    ("Licence Biologie","licence","sciences","fr",36),
    ("Master Médecine","master","medicine","fr",24),
    ("Licence Droit","licence","law","fr",36),
    ("Master Relations Internationales","master","humanities","fr",24),
    ("Master Mechanical Engineering","master","engineering","en",24),
    ("Licence Arts et Design","licence","arts","fr",36),
    ("Certificate German Language B2","certificate","humanities","de",6),
    ("Master Architecture & Urban Planning","master","arts","fr",24),
    ("Licence Pharmacie","licence","medicine","fr",60),
    ("Master Tourism & Hospitality Management","master","business","en",24),
    ("Master Cybersecurity","master","engineering","en",24),
    ("Master Environmental Engineering","master","engineering","en",24),
]

# ── SCHOLARSHIPS ─────────────────────────────────────────
SCHOLARSHIPS = [
    {"name":"Bourse du Gouvernement Français (BGF)","provider":"Ambassade de France au Maroc","country_code":"FR","eligibility_nationality":["Moroccan"],"eligibility_education_level":["master","phd"],"eligibility_field":[],"eligibility_gpa_min":14,"coverage":{"tuition":True,"living":True,"insurance":True},"amount_description":"Couverture totale: frais, allocations mensuelles 860€/mois, sécurité sociale","application_deadline":"Mars 2026","application_url":"https://ma.ambafrance.org","competitiveness":"very_high","tips":"Dossier académique excellent requis. Priorisez les domaines STEM."},
    {"name":"Bourse Erasmus+ (Mobilité)","provider":"Commission Européenne","country_code":"FR","eligibility_nationality":["Moroccan"],"eligibility_education_level":["licence","master","phd"],"eligibility_field":[],"eligibility_gpa_min":12,"coverage":{"living":True},"amount_description":"800-1100€/mois selon le pays + frais de voyage","application_deadline":"Février 2026","application_url":"https://erasmus-plus.ec.europa.eu","competitiveness":"high","tips":"Postulez via votre université partenaire. Lettre de motivation cruciale."},
    {"name":"Bourse d'Excellence CNRST","provider":"CNRST Maroc","country_code":"MA","eligibility_nationality":["Moroccan"],"eligibility_education_level":["phd"],"eligibility_field":["engineering","sciences"],"eligibility_gpa_min":15,"coverage":{"living":True},"amount_description":"8 000 MAD/mois pour doctorants","application_deadline":"Octobre 2026","application_url":"https://www.cnrst.ma","competitiveness":"high","tips":"Projet de recherche solide + directeur de thèse confirmé."},
    {"name":"Bourse OCP Foundation","provider":"OCP Group","country_code":"MA","eligibility_nationality":["Moroccan"],"eligibility_education_level":["licence","master"],"eligibility_field":["engineering","sciences","business"],"eligibility_gpa_min":13,"coverage":{"tuition":True,"living":True},"amount_description":"Couverture complète + allocation mensuelle","application_deadline":"Juillet 2026","application_url":"https://www.ocpgroup.ma/fr/fondation","competitiveness":"medium","tips":"Priorité aux filières scientifiques et ingénierie."},
    {"name":"Bourse MIFI Québec (Exemption)","provider":"Gouvernement du Québec","country_code":"CA","eligibility_nationality":["Moroccan"],"eligibility_education_level":["licence","master","phd"],"eligibility_field":[],"eligibility_gpa_min":12,"coverage":{"tuition":True},"amount_description":"Exemption des droits majorés, frais réduits au niveau québécois (~4 000 CAD/an)","application_deadline":"Mars 2026","application_url":"https://www.quebec.ca/education","competitiveness":"medium","tips":"Priorité francophone. TCF/TEF requis."},
    {"name":"DAAD Scholarship","provider":"DAAD Germany","country_code":"DE","eligibility_nationality":["Moroccan"],"eligibility_education_level":["master","phd"],"eligibility_field":[],"eligibility_gpa_min":13,"coverage":{"tuition":True,"living":True,"insurance":True,"travel":True},"amount_description":"934€/mois (Master), 1 300€/mois (PhD) + voyage + assurance","application_deadline":"Octobre 2026","application_url":"https://www.daad.de","competitiveness":"very_high","tips":"TestDaF ou certificat B2 requis. Lettre de recherche essentielle."},
    {"name":"Chevening Scholarship","provider":"UK Government","country_code":"UK","eligibility_nationality":["Moroccan"],"eligibility_education_level":["master"],"eligibility_field":[],"eligibility_gpa_min":14,"coverage":{"tuition":True,"living":True,"travel":True},"amount_description":"Couverture totale pour 1 an de Master au Royaume-Uni","application_deadline":"Novembre 2026","application_url":"https://www.chevening.org","competitiveness":"very_high","tips":"2 ans d'expérience professionnelle requis. Leadership démontré."},
    {"name":"Bourse Campus France (SSHN)","provider":"Campus France","country_code":"FR","eligibility_nationality":["Moroccan"],"eligibility_education_level":["licence","master"],"eligibility_field":[],"eligibility_gpa_min":13,"coverage":{"living":True,"insurance":True},"amount_description":"615€/mois (Licence), 700€/mois (Master) + sécurité sociale","application_deadline":"Mai 2026","application_url":"https://www.campusfrance.org","competitiveness":"high","tips":"Selection sur dossier académique + entretien Campus France."},
    {"name":"Bourse de la Fondation BMCE","provider":"Fondation BMCE Bank","country_code":"MA","eligibility_nationality":["Moroccan"],"eligibility_education_level":["licence","master"],"eligibility_field":["business","engineering"],"eligibility_gpa_min":14,"coverage":{"tuition":True},"amount_description":"Prise en charge des frais de scolarité dans universités partenaires","application_deadline":"Septembre 2026","application_url":"https://www.fondationbmce.ma","competitiveness":"medium","tips":"Candidature en ligne + test écrit + entretien."},
    {"name":"Bourses d'Excellence de l'Ambassade du Canada","provider":"Ambassade du Canada","country_code":"CA","eligibility_nationality":["Moroccan"],"eligibility_education_level":["master","phd"],"eligibility_field":[],"eligibility_gpa_min":14,"coverage":{"tuition":True,"living":True},"amount_description":"Jusqu'à 50 000 CAD pour études de 2ème/3ème cycle","application_deadline":"Février 2026","application_url":"https://www.scholarships-bourses.gc.ca","competitiveness":"very_high","tips":"IELTS 7.0+ ou TCF C1 requis. Recherche originale valorisée."},
    {"name":"AMCI Bourse","provider":"AMCI (Agence Marocaine)","country_code":"MA","eligibility_nationality":["Moroccan"],"eligibility_education_level":["licence","master","phd"],"eligibility_field":[],"eligibility_gpa_min":12,"coverage":{"living":True},"amount_description":"Allocation mensuelle pour étudiants marocains à l'étranger","application_deadline":"Août 2026","application_url":"https://www.amci.ma","competitiveness":"medium","tips":"Inscription dans une université étrangère requise au préalable."},
    {"name":"Bourse Eiffel","provider":"Ministère de l'Europe et des Affaires étrangères","country_code":"FR","eligibility_nationality":["Moroccan"],"eligibility_education_level":["master","phd"],"eligibility_field":["engineering","sciences","law","business"],"eligibility_gpa_min":14,"coverage":{"living":True,"insurance":True,"travel":True},"amount_description":"1 181€/mois (Master), 1 700€/mois (PhD) + voyage + assurance","application_deadline":"Janvier 2026","application_url":"https://www.campusfrance.org/fr/le-programme-de-bourses-eiffel","competitiveness":"very_high","tips":"Candidature via l'établissement français. Dossier d'excellence requis."},
    {"name":"Beca MAEC-AECID","provider":"Gouvernement espagnol","country_code":"ES","eligibility_nationality":["Moroccan"],"eligibility_education_level":["master","phd"],"eligibility_field":[],"eligibility_gpa_min":13,"coverage":{"tuition":True,"living":True},"amount_description":"1 200€/mois + frais d'inscription","application_deadline":"Avril 2026","application_url":"https://www.exteriores.gob.es","competitiveness":"high","tips":"Niveau B2 espagnol requis. Domaines coopération internationale priorisés."},
    {"name":"Commonwealth Scholarship","provider":"Commonwealth Scholarship Commission","country_code":"UK","eligibility_nationality":["Moroccan"],"eligibility_education_level":["master","phd"],"eligibility_field":[],"eligibility_gpa_min":14,"coverage":{"tuition":True,"living":True,"travel":True},"amount_description":"Couverture complète + allocation mensuelle","application_deadline":"Décembre 2026","application_url":"https://cscuk.fcdo.gov.uk","competitiveness":"very_high","tips":"Forte composante développement. Montrez l'impact sur le Maroc."},
    {"name":"Fondation Mohammed VI Bourse","provider":"Fondation Mohammed VI","country_code":"MA","eligibility_nationality":["Moroccan"],"eligibility_education_level":["licence","master"],"eligibility_field":[],"eligibility_gpa_min":12,"coverage":{"tuition":True,"living":True},"amount_description":"Aide financière pour étudiants méritants","application_deadline":"Octobre 2026","application_url":"https://www.fm6education.ma","competitiveness":"medium","tips":"Critères socio-économiques + excellence académique."},
    # Turkey
    {"name":"Türkiye Bursları (Bourses Turques)","provider":"YTB — Presidency for Turks Abroad","country_code":"TR","eligibility_nationality":["Moroccan"],"eligibility_education_level":["licence","master","phd"],"eligibility_field":[],"eligibility_gpa_min":12,"coverage":{"tuition":True,"living":True,"insurance":True,"travel":True},"amount_description":"Licence: 1 000 TRY/mois, Master: 1 400 TRY/mois, PhD: 1 800 TRY/mois + vol + logement + assurance + cours TÖMER gratuit","application_deadline":"Février 2026","application_url":"https://turkiyeburslari.gov.tr","competitiveness":"high","tips":"Très populaire auprès des Marocains. Lettre de motivation et projet de recherche essentiels. Entretien en ligne."},
    {"name":"Bourse de Mérite des Universités Turques","provider":"Universités turques","country_code":"TR","eligibility_nationality":["Moroccan"],"eligibility_education_level":["licence","master"],"eligibility_field":["engineering","sciences"],"eligibility_gpa_min":14,"coverage":{"tuition":True},"amount_description":"Exonération totale ou partielle des frais de scolarité","application_deadline":"Juin 2026","application_url":"https://www.studyinturkey.gov.tr","competitiveness":"medium","tips":"Postulez directement aux universités. Koç et Sabancı offrent des bourses généreuses."},
    # Spain (additional)
    {"name":"Beca AECID (Coopération Espagnole)","provider":"AECID Espagne","country_code":"ES","eligibility_nationality":["Moroccan"],"eligibility_education_level":["master","phd"],"eligibility_field":[],"eligibility_gpa_min":13,"coverage":{"tuition":True,"living":True,"insurance":True},"amount_description":"1 200€/mois + frais d'inscription + assurance santé","application_deadline":"Mars 2026","application_url":"https://www.aecid.es","competitiveness":"high","tips":"DELE B2 requis minimum. Proximité culturelle Maroc-Espagne valorisée."},
    # Germany (additional)
    {"name":"Heinrich Böll Stiftung Scholarship","provider":"Fondation Heinrich Böll","country_code":"DE","eligibility_nationality":["Moroccan"],"eligibility_education_level":["master","phd"],"eligibility_field":[],"eligibility_gpa_min":13,"coverage":{"living":True},"amount_description":"934€/mois + allocation livres + voyage","application_deadline":"Mars 2026","application_url":"https://www.boell.de","competitiveness":"high","tips":"Engagement social et écologique requis. Très sélectif."},
    {"name":"Konrad Adenauer Stiftung","provider":"Fondation Konrad Adenauer","country_code":"DE","eligibility_nationality":["Moroccan"],"eligibility_education_level":["master","phd"],"eligibility_field":["humanities","law","business"],"eligibility_gpa_min":14,"coverage":{"living":True},"amount_description":"934€/mois + allocation livres","application_deadline":"Juillet 2026","application_url":"https://www.kas.de","competitiveness":"very_high","tips":"Engagement politique et social valorisé. Entretien requis."},
]

# ── ROADMAP TEMPLATES ────────────────────────────────────
ROADMAP_TEMPLATES = [
    {
        "country_code":"FR","pathway":"france_l1_dap","name":"France — L1 via Campus France DAP","total_steps":20,"estimated_duration_weeks":32,
        "steps":[
            {"phase":1,"order":1,"title":"Créer un compte Campus France","description":"Inscrivez-vous sur Études en France","cost_mad":0,"tips":"Utilisez votre email personnel, pas Yahoo."},
            {"phase":2,"order":2,"title":"S'inscrire au TCF DAP à l'Institut Français","description":"Réservez votre place rapidement, les créneaux partent vite.","cost_mad":1500,"tips":"Casablanca remplit en premier."},
            {"phase":2,"order":3,"title":"Passer le TCF DAP","description":"Jour de l'examen — arrivez 30 min en avance.","cost_mad":0,"tips":"Révisez bien l'expression écrite."},
            {"phase":3,"order":4,"title":"Rassembler Bac + Relevé de notes","description":"Copies certifiées conformes.","cost_mad":50,"tips":"Allez au rectorat tôt le matin."},
            {"phase":3,"order":5,"title":"Obtenir le casier judiciaire","description":"Demande en ligne ou au tribunal.","cost_mad":0,"tips":"Disponible en 3-5 jours."},
            {"phase":3,"order":6,"title":"Obtenir l'acte de naissance","description":"Commune de naissance.","cost_mad":0,"tips":"Peut être fait le même jour."},
            {"phase":3,"order":7,"title":"Traduire tous les documents","description":"Par un traducteur assermenté.","cost_mad":500,"tips":"Demandez un devis d'abord."},
            {"phase":4,"order":8,"title":"Remplir le formulaire Campus France","description":"Uploadez tous les documents.","cost_mad":1800,"tips":"Vérifiez chaque champ deux fois."},
            {"phase":4,"order":9,"title":"Choisir 3 programmes (vœux DAP)","description":"Avant le 17 janvier.","cost_mad":0,"tips":"Mettez votre premier choix en vœu 1."},
            {"phase":4,"order":10,"title":"Rédiger la lettre de motivation","description":"Une par vœu si les programmes sont différents.","cost_mad":0,"tips":"Parlez de votre projet professionnel."},
            {"phase":4,"order":11,"title":"Rédiger le projet d'études","description":"Structure: situation actuelle → pourquoi ce domaine → pourquoi la France → objectifs.","cost_mad":0,"tips":"Max 2 pages, soyez spécifique."},
            {"phase":5,"order":12,"title":"Entretien Campus France","description":"Préparez votre projet, soyez confiant.","cost_mad":0,"tips":"Entraînez-vous avec un ami."},
            {"phase":6,"order":13,"title":"Attendre la réponse d'admission","description":"Avril-Juin — patience!","cost_mad":0,"tips":"Vérifiez Études en France régulièrement."},
            {"phase":6,"order":14,"title":"Accepter l'offre d'admission","description":"Dans le délai indiqué.","cost_mad":0,"tips":"Ne tardez pas!"},
            {"phase":7,"order":15,"title":"Ouvrir un compte bloqué","description":"Dépôt de 7 380€ requis.","cost_mad":80000,"tips":"Banque Populaire ou CIH proposent ce service."},
            {"phase":7,"order":16,"title":"Réserver le RDV visa à VFS/Consulat","description":"2-4 semaines d'attente.","cost_mad":500,"tips":"Réservez dès l'acceptation."},
            {"phase":7,"order":17,"title":"RDV visa — déposer le dossier","description":"Tous les originaux + copies.","cost_mad":0,"tips":"Arrivez 15 min en avance."},
            {"phase":7,"order":18,"title":"Recevoir le visa","description":"2-3 semaines après le RDV.","cost_mad":0,"tips":"Suivez le tracking VFS."},
            {"phase":8,"order":19,"title":"Réserver un logement","description":"CROUS ou logement privé.","cost_mad":0,"tips":"Postulez CROUS dès avril."},
            {"phase":8,"order":20,"title":"Réserver le vol + préparer l'arrivée","description":"Billet + valises + premiers jours.","cost_mad":4000,"tips":"Ryanair/Transavia souvent moins cher."},
        ]
    },
    {
        "country_code":"FR","pathway":"france_master_hors_dap","name":"France — Master Hors-DAP","total_steps":16,"estimated_duration_weeks":28,
        "steps":[
            {"phase":1,"order":1,"title":"Créer un compte Études en France","description":"Inscription sur la plateforme Campus France Maroc.","cost_mad":0},
            {"phase":2,"order":2,"title":"Passer le TCF TP ou DELF B2","description":"Score B2 minimum requis pour la plupart des Masters.","cost_mad":1500},
            {"phase":3,"order":3,"title":"Rassembler les diplômes et relevés","description":"Licence + relevés de notes certifiés.","cost_mad":100},
            {"phase":3,"order":4,"title":"Traduire les documents","description":"Traducteur assermenté pour tous les documents.","cost_mad":600},
            {"phase":4,"order":5,"title":"Remplir le formulaire Études en France","description":"Hors-DAP: jusqu'à 7 vœux Master.","cost_mad":1800},
            {"phase":4,"order":6,"title":"Candidater directement sur eCandidat/MonMaster","description":"Certains Masters exigent une candidature parallèle.","cost_mad":0},
            {"phase":4,"order":7,"title":"Rédiger lettre de motivation + CV","description":"Adaptez pour chaque programme.","cost_mad":0},
            {"phase":5,"order":8,"title":"Entretien Campus France","description":"Présentez votre projet de manière cohérente.","cost_mad":0},
            {"phase":6,"order":9,"title":"Attendre les réponses","description":"Mars-Juin selon les universités.","cost_mad":0},
            {"phase":6,"order":10,"title":"Accepter une offre","description":"Confirmez sur la plateforme.","cost_mad":0},
            {"phase":7,"order":11,"title":"Ouvrir un compte bloqué","description":"7 380€ minimum.","cost_mad":80000},
            {"phase":7,"order":12,"title":"RDV visa","description":"Déposez le dossier complet.","cost_mad":500},
            {"phase":7,"order":13,"title":"Obtenir le visa","description":"2-3 semaines de traitement.","cost_mad":0},
            {"phase":8,"order":14,"title":"Logement","description":"CROUS ou location privée.","cost_mad":0},
            {"phase":8,"order":15,"title":"Assurance santé","description":"Inscription sécurité sociale étudiante.","cost_mad":0},
            {"phase":8,"order":16,"title":"Voyage et installation","description":"Billet + premiers jours.","cost_mad":4000},
        ]
    },
    {
        "country_code":"CA","pathway":"canada_master","name":"Canada — Master's Degree","total_steps":14,"estimated_duration_weeks":36,
        "steps":[
            {"phase":1,"order":1,"title":"Choisir les universités cibles","description":"Comparez les programmes, délais, et exigences.","cost_mad":0},
            {"phase":2,"order":2,"title":"Passer le IELTS ou TEF Canada","description":"Score requis: IELTS 6.5+ ou TEF B2+.","cost_mad":3200},
            {"phase":3,"order":3,"title":"Rassembler les documents","description":"Diplômes, relevés, lettres de recommandation.","cost_mad":200},
            {"phase":3,"order":4,"title":"WES Credential Evaluation","description":"Évaluation des diplômes marocains.","cost_mad":2500},
            {"phase":4,"order":5,"title":"Candidater en ligne","description":"Via le portail de chaque université.","cost_mad":1500},
            {"phase":4,"order":6,"title":"Rédiger Statement of Purpose","description":"Projet de recherche + motivation.","cost_mad":0},
            {"phase":5,"order":7,"title":"Attendre les admissions","description":"2-4 mois après la candidature.","cost_mad":0},
            {"phase":5,"order":8,"title":"Accepter l'offre + payer le dépôt","description":"Dépôt de confirmation requis.","cost_mad":5000},
            {"phase":6,"order":9,"title":"Demander le CAQ (Québec)","description":"Certificat d'acceptation du Québec (si applicable).","cost_mad":1200},
            {"phase":6,"order":10,"title":"Demander le permis d'études","description":"Via le portail IRCC en ligne.","cost_mad":1500},
            {"phase":7,"order":11,"title":"Biométrie","description":"RDV au centre VFS.","cost_mad":850},
            {"phase":7,"order":12,"title":"Recevoir le permis d'études","description":"4-8 semaines de traitement.","cost_mad":0},
            {"phase":8,"order":13,"title":"Réserver logement + assurance","description":"Résidence universitaire ou colocation.","cost_mad":0},
            {"phase":8,"order":14,"title":"Voyage et installation","description":"Vol + orientation + premiers jours.","cost_mad":8000},
        ]
    },
    {
        "country_code":"DE","pathway":"germany_master","name":"Germany — Master (English-taught)","total_steps":13,"estimated_duration_weeks":30,
        "steps":[
            {"phase":1,"order":1,"title":"Rechercher les programmes sur DAAD","description":"Utilisez le moteur de recherche DAAD.","cost_mad":0},
            {"phase":2,"order":2,"title":"Passer le IELTS ou TestDaF","description":"IELTS 6.5+ pour programmes anglophones, TestDaF TDN4 pour germanophones.","cost_mad":3200},
            {"phase":3,"order":3,"title":"Rassembler les documents","description":"Diplômes, relevés, CV Europass.","cost_mad":200},
            {"phase":3,"order":4,"title":"Évaluation anabin/uni-assist","description":"Vérification de l'équivalence du diplôme.","cost_mad":800},
            {"phase":4,"order":5,"title":"Candidater via uni-assist","description":"Soumettre dossier + frais.","cost_mad":750},
            {"phase":5,"order":6,"title":"Attendre la réponse","description":"4-8 semaines.","cost_mad":0},
            {"phase":5,"order":7,"title":"Accepter l'offre","description":"Confirmer et recevoir la Zulassung.","cost_mad":0},
            {"phase":6,"order":8,"title":"Ouvrir un Sperrkonto","description":"Compte bloqué: 11 208€.","cost_mad":120000},
            {"phase":7,"order":9,"title":"RDV visa à l'ambassade","description":"Déposer le dossier complet.","cost_mad":750},
            {"phase":7,"order":10,"title":"Recevoir le visa","description":"4-6 semaines.","cost_mad":0},
            {"phase":8,"order":11,"title":"S'inscrire à l'assurance santé","description":"TK, AOK ou DAK obligatoire.","cost_mad":0},
            {"phase":8,"order":12,"title":"Anmeldung (enregistrement)","description":"Inscription à la mairie dans les 2 semaines.","cost_mad":0},
            {"phase":8,"order":13,"title":"Voyage et installation","description":"Vol + orientation week.","cost_mad":5000},
        ]
    },
    {
        "country_code":"UK","pathway":"uk_bachelor","name":"United Kingdom — Bachelor's via UCAS","total_steps":12,"estimated_duration_weeks":34,
        "steps":[
            {"phase":1,"order":1,"title":"Créer un compte UCAS","description":"Inscription sur ucas.com.","cost_mad":0},
            {"phase":2,"order":2,"title":"Passer le IELTS Academic","description":"Score minimum 6.0-6.5 selon l'université.","cost_mad":3200},
            {"phase":3,"order":3,"title":"Rassembler les documents","description":"Bac + relevés + lettre de recommandation.","cost_mad":200},
            {"phase":4,"order":4,"title":"Rédiger le Personal Statement","description":"4 000 caractères max, une seule version pour tous les choix.","cost_mad":0},
            {"phase":4,"order":5,"title":"Soumettre l'application UCAS","description":"5 choix maximum, deadline 15 janvier.","cost_mad":350},
            {"phase":5,"order":6,"title":"Attendre les offres","description":"Conditional/Unconditional offers.","cost_mad":0},
            {"phase":5,"order":7,"title":"Choisir Firm + Insurance","description":"Un choix principal + un choix de sécurité.","cost_mad":0},
            {"phase":6,"order":8,"title":"Obtenir le CAS","description":"Confirmation of Acceptance for Studies.","cost_mad":0},
            {"phase":7,"order":9,"title":"Demander le Student Visa","description":"En ligne + biométrie au centre VFS.","cost_mad":8500},
            {"phase":7,"order":10,"title":"Payer le Immigration Health Surcharge","description":"IHS: £470/an.","cost_mad":6000},
            {"phase":8,"order":11,"title":"Ouvrir un compte bancaire UK","description":"Monzo/Revolut avant le départ, ou Barclays sur place.","cost_mad":0},
            {"phase":8,"order":12,"title":"Voyage et fresher's week","description":"Arrivez quelques jours avant.","cost_mad":5000},
        ]
    },
]


async def seed():
    print("🌱 Seeding Tawjih V4 database...")

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        from sqlalchemy import select, func
        count = await db.execute(select(func.count()).select_from(School))
        if count.scalar() > 0:
            print("⚠️  Database already has data. Skipping seed.")
            return

        # Schools
        school_ids = {}
        for s in SCHOOLS:
            school = School(**s)
            db.add(school)
            await db.flush()
            school_ids[s["short_name"]] = school.id
        print(f"  ✅ {len(SCHOOLS)} schools inserted")

        # Programs — distribute across schools
        program_count = 0
        school_list = list(school_ids.items())
        for i, (name, degree, field, lang, duration) in enumerate(PROGRAM_TEMPLATES):
            # Assign to 4 schools each to get ~60 programs
            for j in range(4):
                idx = (i * 4 + j) % len(school_list)
                sname, sid = school_list[idx]
                school_data = next(s for s in SCHOOLS if s["short_name"] == sname)
                is_moroccan = school_data["country_code"] == "MA"

                program = Program(
                    school_id=sid,
                    name=name,
                    degree_type=degree,
                    field_category=field,
                    language_of_instruction=lang,
                    duration_months=duration,
                    is_moroccan=is_moroccan,
                    admission_requirements={"min_gpa": 12 + (j % 4), "documents": ["transcripts", "cv", "motivation_letter"]},
                    career_outcomes=[{"title": f"Graduate in {field}", "avg_salary": 35000 + j * 5000}],
                )
                db.add(program)
                program_count += 1
        print(f"  ✅ {program_count} programs inserted")

        # Scholarships
        for s in SCHOLARSHIPS:
            scholarship = Scholarship(**s)
            db.add(scholarship)
        print(f"  ✅ {len(SCHOLARSHIPS)} scholarships inserted")

        # Roadmap Templates
        for t in ROADMAP_TEMPLATES:
            template = RoadmapTemplate(**t)
            db.add(template)
        print(f"  ✅ {len(ROADMAP_TEMPLATES)} roadmap templates inserted")

        await db.commit()
        print("🟢 Seed complete!")


# ── MONGODB: CAREER PATHS ────────────────────────────────

CAREER_PATHS = [
    {
        "name": "Software Engineering",
        "category": "engineering",
        "riasec_codes": ["I", "R", "C"],
        "required_education": ["bac+3", "bac+5"],
        "job_titles": ["Software Engineer", "Full-Stack Developer", "DevOps Engineer", "Backend Developer"],
        "automation_risk": "low",
        "market_data": {
            "morocco": {"demand": "high", "avg_salary_mad": 180000, "growth_pct": 15},
            "france": {"demand": "very_high", "avg_salary_eur": 45000, "growth_pct": 12},
            "canada": {"demand": "very_high", "avg_salary_cad": 85000, "growth_pct": 18},
            "germany": {"demand": "very_high", "avg_salary_eur": 55000, "growth_pct": 14},
        },
    },
    {
        "name": "Data Science & AI",
        "category": "engineering",
        "riasec_codes": ["I", "C", "A"],
        "required_education": ["bac+5"],
        "job_titles": ["Data Scientist", "ML Engineer", "AI Researcher", "Data Analyst"],
        "automation_risk": "low",
        "market_data": {
            "morocco": {"demand": "high", "avg_salary_mad": 200000, "growth_pct": 22},
            "france": {"demand": "very_high", "avg_salary_eur": 52000, "growth_pct": 20},
            "canada": {"demand": "very_high", "avg_salary_cad": 95000, "growth_pct": 25},
            "germany": {"demand": "very_high", "avg_salary_eur": 60000, "growth_pct": 19},
        },
    },
    {
        "name": "Medicine",
        "category": "medicine",
        "riasec_codes": ["I", "S", "R"],
        "required_education": ["bac+7", "bac+11"],
        "job_titles": ["Médecin Généraliste", "Chirurgien", "Cardiologue", "Pédiatre"],
        "automation_risk": "low",
        "market_data": {
            "morocco": {"demand": "very_high", "avg_salary_mad": 300000, "growth_pct": 8},
            "france": {"demand": "very_high", "avg_salary_eur": 70000, "growth_pct": 5},
            "canada": {"demand": "very_high", "avg_salary_cad": 180000, "growth_pct": 6},
            "germany": {"demand": "very_high", "avg_salary_eur": 75000, "growth_pct": 4},
        },
    },
    {
        "name": "Business & Finance",
        "category": "business",
        "riasec_codes": ["E", "C", "S"],
        "required_education": ["bac+3", "bac+5"],
        "job_titles": ["Financial Analyst", "Consultant", "Investment Banker", "Audit Manager"],
        "automation_risk": "medium",
        "market_data": {
            "morocco": {"demand": "high", "avg_salary_mad": 160000, "growth_pct": 10},
            "france": {"demand": "high", "avg_salary_eur": 42000, "growth_pct": 7},
            "canada": {"demand": "high", "avg_salary_cad": 75000, "growth_pct": 9},
            "germany": {"demand": "high", "avg_salary_eur": 50000, "growth_pct": 8},
        },
    },
    {
        "name": "Civil Engineering",
        "category": "engineering",
        "riasec_codes": ["R", "I", "C"],
        "required_education": ["bac+5"],
        "job_titles": ["Ingénieur Génie Civil", "Chef de Projet BTP", "Ingénieur Structure"],
        "automation_risk": "low",
        "market_data": {
            "morocco": {"demand": "very_high", "avg_salary_mad": 170000, "growth_pct": 12},
            "france": {"demand": "high", "avg_salary_eur": 38000, "growth_pct": 6},
            "canada": {"demand": "high", "avg_salary_cad": 80000, "growth_pct": 8},
            "germany": {"demand": "high", "avg_salary_eur": 48000, "growth_pct": 7},
        },
    },
    {
        "name": "Law",
        "category": "law",
        "riasec_codes": ["E", "I", "S"],
        "required_education": ["bac+5", "bac+7"],
        "job_titles": ["Avocat", "Juriste d'entreprise", "Notaire", "Magistrat"],
        "automation_risk": "medium",
        "market_data": {
            "morocco": {"demand": "medium", "avg_salary_mad": 140000, "growth_pct": 5},
            "france": {"demand": "medium", "avg_salary_eur": 40000, "growth_pct": 3},
            "canada": {"demand": "high", "avg_salary_cad": 90000, "growth_pct": 6},
            "germany": {"demand": "medium", "avg_salary_eur": 55000, "growth_pct": 4},
        },
    },
    {
        "name": "Cybersecurity",
        "category": "engineering",
        "riasec_codes": ["I", "R", "C"],
        "required_education": ["bac+5"],
        "job_titles": ["Security Analyst", "Pentester", "CISO", "SOC Analyst"],
        "automation_risk": "low",
        "market_data": {
            "morocco": {"demand": "high", "avg_salary_mad": 220000, "growth_pct": 28},
            "france": {"demand": "very_high", "avg_salary_eur": 48000, "growth_pct": 24},
            "canada": {"demand": "very_high", "avg_salary_cad": 95000, "growth_pct": 30},
            "germany": {"demand": "very_high", "avg_salary_eur": 58000, "growth_pct": 26},
        },
    },
    {
        "name": "Architecture & Urban Planning",
        "category": "arts",
        "riasec_codes": ["A", "R", "I"],
        "required_education": ["bac+5", "bac+6"],
        "job_titles": ["Architecte", "Urbaniste", "Designer d'intérieur", "BIM Manager"],
        "automation_risk": "medium",
        "market_data": {
            "morocco": {"demand": "high", "avg_salary_mad": 150000, "growth_pct": 9},
            "france": {"demand": "medium", "avg_salary_eur": 35000, "growth_pct": 4},
            "canada": {"demand": "medium", "avg_salary_cad": 70000, "growth_pct": 5},
            "germany": {"demand": "medium", "avg_salary_eur": 42000, "growth_pct": 5},
        },
    },
    {
        "name": "Environmental Engineering",
        "category": "engineering",
        "riasec_codes": ["I", "R", "S"],
        "required_education": ["bac+5"],
        "job_titles": ["Ingénieur Environnement", "Consultant HSE", "Chef de projet Énergie"],
        "automation_risk": "low",
        "market_data": {
            "morocco": {"demand": "high", "avg_salary_mad": 160000, "growth_pct": 18},
            "france": {"demand": "very_high", "avg_salary_eur": 40000, "growth_pct": 16},
            "canada": {"demand": "very_high", "avg_salary_cad": 80000, "growth_pct": 20},
            "germany": {"demand": "very_high", "avg_salary_eur": 50000, "growth_pct": 17},
        },
    },
    {
        "name": "Marketing & Communication",
        "category": "business",
        "riasec_codes": ["E", "A", "S"],
        "required_education": ["bac+3", "bac+5"],
        "job_titles": ["Digital Marketing Manager", "Brand Strategist", "Content Manager", "Growth Hacker"],
        "automation_risk": "high",
        "market_data": {
            "morocco": {"demand": "high", "avg_salary_mad": 120000, "growth_pct": 14},
            "france": {"demand": "high", "avg_salary_eur": 35000, "growth_pct": 10},
            "canada": {"demand": "high", "avg_salary_cad": 65000, "growth_pct": 12},
            "germany": {"demand": "medium", "avg_salary_eur": 40000, "growth_pct": 9},
        },
    },
]

# ── MONGODB: MARKET SNAPSHOTS ────────────────────────────

MARKET_SNAPSHOTS = [
    {"career_name": "Software Engineering", "country": "FR", "job_postings_count": 18500, "avg_salary": 47000, "salary_growth_yoy": 5.2, "unemployment_rate_field": 2.1, "top_employers": ["Google", "Capgemini", "Thales", "Dassault", "OVH"], "required_skills": ["Python", "JavaScript", "Cloud", "CI/CD", "Docker"]},
    {"career_name": "Software Engineering", "country": "CA", "job_postings_count": 22000, "avg_salary": 88000, "salary_growth_yoy": 6.1, "unemployment_rate_field": 1.8, "top_employers": ["Shopify", "Google", "Amazon", "Microsoft", "Ubisoft"], "required_skills": ["Python", "Go", "AWS", "Kubernetes", "React"]},
    {"career_name": "Software Engineering", "country": "DE", "job_postings_count": 15000, "avg_salary": 58000, "salary_growth_yoy": 4.8, "unemployment_rate_field": 2.5, "top_employers": ["SAP", "Siemens", "Bosch", "BMW", "Zalando"], "required_skills": ["Java", "Python", "AWS", "Spring", "Angular"]},
    {"career_name": "Data Science & AI", "country": "FR", "job_postings_count": 8500, "avg_salary": 55000, "salary_growth_yoy": 8.5, "unemployment_rate_field": 1.5, "top_employers": ["Criteo", "Dataiku", "BNP Paribas", "Total", "Airbus"], "required_skills": ["Python", "TensorFlow", "SQL", "Statistics", "Deep Learning"]},
    {"career_name": "Data Science & AI", "country": "CA", "job_postings_count": 12000, "avg_salary": 100000, "salary_growth_yoy": 9.2, "unemployment_rate_field": 1.2, "top_employers": ["Element AI", "Google", "RBC", "Shopify", "MILA"], "required_skills": ["Python", "PyTorch", "NLP", "MLOps", "Cloud"]},
    {"career_name": "Cybersecurity", "country": "FR", "job_postings_count": 6200, "avg_salary": 50000, "salary_growth_yoy": 10.5, "unemployment_rate_field": 0.8, "top_employers": ["Thales", "Airbus CyberSecurity", "Orange Cyberdefense", "ANSSI"], "required_skills": ["Network Security", "SIEM", "Pentest", "Cloud Security", "Incident Response"]},
    {"career_name": "Cybersecurity", "country": "CA", "job_postings_count": 9000, "avg_salary": 98000, "salary_growth_yoy": 12.0, "unemployment_rate_field": 0.5, "top_employers": ["BlackBerry", "Deloitte", "KPMG", "RBC", "CSE"], "required_skills": ["Threat Hunting", "Cloud Security", "Zero Trust", "SOC", "Forensics"]},
    {"career_name": "Medicine", "country": "FR", "job_postings_count": 25000, "avg_salary": 72000, "salary_growth_yoy": 3.0, "unemployment_rate_field": 0.5, "top_employers": ["AP-HP", "CHU", "Cliniques privées", "Médecins Sans Frontières"], "required_skills": ["Clinical Diagnosis", "Surgery", "Research", "Patient Care"]},
    {"career_name": "Environmental Engineering", "country": "FR", "job_postings_count": 4500, "avg_salary": 42000, "salary_growth_yoy": 7.5, "unemployment_rate_field": 3.0, "top_employers": ["EDF", "Veolia", "Engie", "Suez", "TotalEnergies"], "required_skills": ["Environmental Impact Assessment", "GIS", "Water Treatment", "Renewable Energy"]},
    {"career_name": "Environmental Engineering", "country": "CA", "job_postings_count": 6000, "avg_salary": 82000, "salary_growth_yoy": 9.0, "unemployment_rate_field": 2.5, "top_employers": ["Hydro-Québec", "SNC-Lavalin", "Golder", "AECOM"], "required_skills": ["Environmental Science", "GIS", "Climate Modeling", "EIA", "Sustainability"]},
]

# ── MONGODB: QUESTION BANK ───────────────────────────────

QUESTION_BANK = [
    # IELTS Academic — Reading
    {"exam_code": "ielts_academic", "section": "reading", "question_type": "mcq", "difficulty": 0.5, "cefr_level": "B2",
     "content": {"passage": "The rapid urbanization of cities in developing countries has led to significant challenges in waste management. Municipal solid waste generation has increased dramatically, with many cities struggling to collect and dispose of waste effectively.", "question_text": "What is the main challenge discussed in the passage?", "options": [{"id": "A", "text": "Population growth"}, {"id": "B", "text": "Waste management in urbanizing cities"}, {"id": "C", "text": "Industrial pollution"}, {"id": "D", "text": "Water scarcity"}], "correct_answer": "B"}},
    {"exam_code": "ielts_academic", "section": "reading", "question_type": "mcq", "difficulty": 0.6, "cefr_level": "B2",
     "content": {"passage": "Renewable energy sources, particularly solar and wind power, have experienced remarkable cost reductions over the past decade. The levelized cost of solar photovoltaic electricity has fallen by approximately 85% since 2010.", "question_text": "By how much has the cost of solar PV fallen since 2010?", "options": [{"id": "A", "text": "50%"}, {"id": "B", "text": "65%"}, {"id": "C", "text": "85%"}, {"id": "D", "text": "95%"}], "correct_answer": "C"}},
    {"exam_code": "ielts_academic", "section": "reading", "question_type": "true_false", "difficulty": 0.4, "cefr_level": "B1",
     "content": {"passage": "The Great Barrier Reef, located off the coast of Queensland, Australia, is the world's largest coral reef system. It stretches over 2,300 kilometers and is visible from space.", "question_text": "The Great Barrier Reef is visible from space.", "options": [{"id": "T", "text": "True"}, {"id": "F", "text": "False"}, {"id": "NG", "text": "Not Given"}], "correct_answer": "T"}},
    {"exam_code": "ielts_academic", "section": "reading", "question_type": "fill_blank", "difficulty": 0.7, "cefr_level": "C1",
     "content": {"passage": "The phenomenon of brain drain refers to the emigration of highly trained or qualified people from a particular country. This is particularly acute in developing nations where medical professionals seek better opportunities abroad.", "question_text": "The emigration of highly qualified people is called ___.", "correct_answer": "brain drain"}},
    # IELTS Academic — Listening
    {"exam_code": "ielts_academic", "section": "listening", "question_type": "mcq", "difficulty": 0.5, "cefr_level": "B2",
     "content": {"question_text": "The speaker mentions that the library closes at what time on weekdays?", "options": [{"id": "A", "text": "6 PM"}, {"id": "B", "text": "8 PM"}, {"id": "C", "text": "10 PM"}, {"id": "D", "text": "Midnight"}], "correct_answer": "C"}},
    {"exam_code": "ielts_academic", "section": "listening", "question_type": "mcq", "difficulty": 0.6, "cefr_level": "B2",
     "content": {"question_text": "According to the lecture, what percentage of global emissions comes from transportation?", "options": [{"id": "A", "text": "14%"}, {"id": "B", "text": "24%"}, {"id": "C", "text": "34%"}, {"id": "D", "text": "44%"}], "correct_answer": "B"}},
    {"exam_code": "ielts_academic", "section": "listening", "question_type": "fill_blank", "difficulty": 0.5, "cefr_level": "B2",
     "content": {"question_text": "The student needs to submit the assignment by ___.", "correct_answer": "Friday"}},
    # TCF — Compréhension orale
    {"exam_code": "tcf_tp", "section": "comprehension_orale", "question_type": "mcq", "difficulty": 0.4, "cefr_level": "A2",
     "content": {"question_text": "Dans quel contexte se déroule cette conversation ?", "options": [{"id": "A", "text": "À la gare"}, {"id": "B", "text": "Au supermarché"}, {"id": "C", "text": "À l'hôpital"}, {"id": "D", "text": "Au restaurant"}], "correct_answer": "D"}},
    {"exam_code": "tcf_tp", "section": "comprehension_orale", "question_type": "mcq", "difficulty": 0.5, "cefr_level": "B1",
     "content": {"question_text": "Que demande le client au serveur ?", "options": [{"id": "A", "text": "L'addition"}, {"id": "B", "text": "Le menu"}, {"id": "C", "text": "Un verre d'eau"}, {"id": "D", "text": "La carte des desserts"}], "correct_answer": "B"}},
    {"exam_code": "tcf_tp", "section": "comprehension_orale", "question_type": "mcq", "difficulty": 0.7, "cefr_level": "B2",
     "content": {"question_text": "Quel est le sujet principal de ce reportage ?", "options": [{"id": "A", "text": "La politique française"}, {"id": "B", "text": "L'impact du changement climatique sur l'agriculture"}, {"id": "C", "text": "Les nouvelles technologies"}, {"id": "D", "text": "Le système éducatif"}], "correct_answer": "B"}},
    # TCF — Maîtrise des structures
    {"exam_code": "tcf_tp", "section": "maitrise_structures", "question_type": "mcq", "difficulty": 0.4, "cefr_level": "A2",
     "content": {"question_text": "Je ___ au cinéma hier soir.", "options": [{"id": "A", "text": "vais"}, {"id": "B", "text": "suis allé"}, {"id": "C", "text": "irai"}, {"id": "D", "text": "allais"}], "correct_answer": "B"}},
    {"exam_code": "tcf_tp", "section": "maitrise_structures", "question_type": "mcq", "difficulty": 0.6, "cefr_level": "B1",
     "content": {"question_text": "Si j'avais plus de temps, je ___ un cours de français.", "options": [{"id": "A", "text": "prends"}, {"id": "B", "text": "prendrai"}, {"id": "C", "text": "prendrais"}, {"id": "D", "text": "ai pris"}], "correct_answer": "C"}},
    {"exam_code": "tcf_tp", "section": "maitrise_structures", "question_type": "mcq", "difficulty": 0.8, "cefr_level": "C1",
     "content": {"question_text": "Il est impératif que vous ___ avant la date limite.", "options": [{"id": "A", "text": "soumettez"}, {"id": "B", "text": "soumettiez"}, {"id": "C", "text": "soumettrez"}, {"id": "D", "text": "avez soumis"}], "correct_answer": "B"}},
    # TCF — Compréhension écrite
    {"exam_code": "tcf_tp", "section": "comprehension_ecrite", "question_type": "mcq", "difficulty": 0.5, "cefr_level": "B1",
     "content": {"passage": "La municipalité de Casablanca a annoncé un nouveau projet de tramway reliant le quartier Ain Diab au centre-ville. Les travaux devraient commencer au printemps 2026.", "question_text": "Quand les travaux du tramway doivent-ils commencer ?", "options": [{"id": "A", "text": "Automne 2025"}, {"id": "B", "text": "Printemps 2026"}, {"id": "C", "text": "Été 2026"}, {"id": "D", "text": "Hiver 2027"}], "correct_answer": "B"}},
    {"exam_code": "tcf_tp", "section": "comprehension_ecrite", "question_type": "mcq", "difficulty": 0.6, "cefr_level": "B2",
     "content": {"passage": "L'Université Mohammed V de Rabat a signé un accord de partenariat avec l'École Polytechnique de Paris pour faciliter les échanges étudiants. Ce programme permettra à 50 étudiants marocains de poursuivre un semestre d'études en France chaque année.", "question_text": "Combien d'étudiants peuvent bénéficier de ce programme par an ?", "options": [{"id": "A", "text": "25"}, {"id": "B", "text": "50"}, {"id": "C", "text": "100"}, {"id": "D", "text": "200"}], "correct_answer": "B"}},
    # TOEFL — Reading
    {"exam_code": "toefl_ibt", "section": "reading", "question_type": "mcq", "difficulty": 0.6, "cefr_level": "B2",
     "content": {"passage": "Photosynthesis is the process by which green plants and certain other organisms transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.", "question_text": "According to the passage, photosynthesis converts light energy into:", "options": [{"id": "A", "text": "Electrical energy"}, {"id": "B", "text": "Chemical energy"}, {"id": "C", "text": "Thermal energy"}, {"id": "D", "text": "Kinetic energy"}], "correct_answer": "B"}},
    {"exam_code": "toefl_ibt", "section": "reading", "question_type": "mcq", "difficulty": 0.7, "cefr_level": "C1",
     "content": {"passage": "The concept of neuroplasticity has revolutionized our understanding of the brain. Rather than being a fixed organ with predetermined capabilities, research has shown that the brain can reorganize itself by forming new neural connections throughout life.", "question_text": "What is the main idea of neuroplasticity as described?", "options": [{"id": "A", "text": "The brain cannot change after childhood"}, {"id": "B", "text": "The brain can form new connections throughout life"}, {"id": "C", "text": "Neural connections are fixed at birth"}, {"id": "D", "text": "The brain loses neurons over time"}], "correct_answer": "B"}},
    # TOEFL — Listening
    {"exam_code": "toefl_ibt", "section": "listening", "question_type": "mcq", "difficulty": 0.5, "cefr_level": "B2",
     "content": {"question_text": "What is the professor's main point about the Industrial Revolution?", "options": [{"id": "A", "text": "It began in France"}, {"id": "B", "text": "It was primarily driven by technological innovation"}, {"id": "C", "text": "It had no lasting effects"}, {"id": "D", "text": "It only affected agriculture"}], "correct_answer": "B"}},
    {"exam_code": "toefl_ibt", "section": "listening", "question_type": "mcq", "difficulty": 0.6, "cefr_level": "B2",
     "content": {"question_text": "According to the conversation, why does the student need to change her schedule?", "options": [{"id": "A", "text": "The class is full"}, {"id": "B", "text": "There is a time conflict with another course"}, {"id": "C", "text": "The professor is on leave"}, {"id": "D", "text": "The class was cancelled"}], "correct_answer": "B"}},
    # BAC Sciences Math — Mathématiques
    {"exam_code": "bac_sciences_math", "section": "mathematiques", "question_type": "mcq", "difficulty": 0.5, "cefr_level": "N/A",
     "content": {"question_text": "Quelle est la dérivée de f(x) = 3x² + 2x - 5 ?", "options": [{"id": "A", "text": "6x + 2"}, {"id": "B", "text": "3x + 2"}, {"id": "C", "text": "6x² + 2"}, {"id": "D", "text": "6x - 5"}], "correct_answer": "A"}},
    {"exam_code": "bac_sciences_math", "section": "mathematiques", "question_type": "mcq", "difficulty": 0.6, "cefr_level": "N/A",
     "content": {"question_text": "Résoudre : log₂(x) = 5. Quelle est la valeur de x ?", "options": [{"id": "A", "text": "10"}, {"id": "B", "text": "25"}, {"id": "C", "text": "32"}, {"id": "D", "text": "64"}], "correct_answer": "C"}},
    {"exam_code": "bac_sciences_math", "section": "mathematiques", "question_type": "mcq", "difficulty": 0.7, "cefr_level": "N/A",
     "content": {"question_text": "L'intégrale de ∫₀¹ 2x dx vaut :", "options": [{"id": "A", "text": "0"}, {"id": "B", "text": "1"}, {"id": "C", "text": "2"}, {"id": "D", "text": "4"}], "correct_answer": "B"}},
    {"exam_code": "bac_sciences_math", "section": "mathematiques", "question_type": "mcq", "difficulty": 0.8, "cefr_level": "N/A",
     "content": {"question_text": "Dans un repère orthonormé, la distance entre A(1,2) et B(4,6) est :", "options": [{"id": "A", "text": "3"}, {"id": "B", "text": "4"}, {"id": "C", "text": "5"}, {"id": "D", "text": "7"}], "correct_answer": "C"}},
    # BAC — Physique Chimie
    {"exam_code": "bac_sciences_math", "section": "physique_chimie", "question_type": "mcq", "difficulty": 0.5, "cefr_level": "N/A",
     "content": {"question_text": "La loi de Newton F = ma relie :", "options": [{"id": "A", "text": "Force, masse et accélération"}, {"id": "B", "text": "Force, masse et vitesse"}, {"id": "C", "text": "Énergie, masse et accélération"}, {"id": "D", "text": "Force, volume et accélération"}], "correct_answer": "A"}},
    {"exam_code": "bac_sciences_math", "section": "physique_chimie", "question_type": "mcq", "difficulty": 0.6, "cefr_level": "N/A",
     "content": {"question_text": "Le pH d'une solution acide est :", "options": [{"id": "A", "text": "Supérieur à 7"}, {"id": "B", "text": "Égal à 7"}, {"id": "C", "text": "Inférieur à 7"}, {"id": "D", "text": "Toujours égal à 0"}], "correct_answer": "C"}},
    {"exam_code": "bac_sciences_math", "section": "physique_chimie", "question_type": "mcq", "difficulty": 0.7, "cefr_level": "N/A",
     "content": {"question_text": "L'énergie cinétique d'un objet de masse 2 kg se déplaçant à 3 m/s est :", "options": [{"id": "A", "text": "6 J"}, {"id": "B", "text": "9 J"}, {"id": "C", "text": "12 J"}, {"id": "D", "text": "18 J"}], "correct_answer": "B"}},
    # BAC — SVT
    {"exam_code": "bac_sciences_math", "section": "svt", "question_type": "mcq", "difficulty": 0.4, "cefr_level": "N/A",
     "content": {"question_text": "La mitose produit :", "options": [{"id": "A", "text": "4 cellules haploïdes"}, {"id": "B", "text": "2 cellules diploïdes identiques"}, {"id": "C", "text": "1 cellule tétraploïde"}, {"id": "D", "text": "4 cellules diploïdes"}], "correct_answer": "B"}},
    {"exam_code": "bac_sciences_math", "section": "svt", "question_type": "mcq", "difficulty": 0.5, "cefr_level": "N/A",
     "content": {"question_text": "L'ADN est composé de :", "options": [{"id": "A", "text": "Acides aminés"}, {"id": "B", "text": "Nucléotides"}, {"id": "C", "text": "Lipides"}, {"id": "D", "text": "Glucides"}], "correct_answer": "B"}},
    # Additional IELTS questions
    {"exam_code": "ielts_academic", "section": "reading", "question_type": "mcq", "difficulty": 0.8, "cefr_level": "C1",
     "content": {"passage": "Artificial intelligence in healthcare has shown promising results in diagnostic accuracy. In a recent study, an AI system correctly identified skin cancer with 95% accuracy, outperforming dermatologists who achieved 87% accuracy.", "question_text": "What accuracy rate did the AI system achieve in identifying skin cancer?", "options": [{"id": "A", "text": "87%"}, {"id": "B", "text": "90%"}, {"id": "C", "text": "95%"}, {"id": "D", "text": "99%"}], "correct_answer": "C"}},
    {"exam_code": "ielts_academic", "section": "listening", "question_type": "mcq", "difficulty": 0.7, "cefr_level": "C1",
     "content": {"question_text": "The researcher suggests that climate change will most significantly affect:", "options": [{"id": "A", "text": "Coastal populations"}, {"id": "B", "text": "Mountain communities"}, {"id": "C", "text": "Desert regions"}, {"id": "D", "text": "Tropical forests"}], "correct_answer": "A"}},
    # Additional TCF questions
    {"exam_code": "tcf_tp", "section": "comprehension_orale", "question_type": "mcq", "difficulty": 0.3, "cefr_level": "A1",
     "content": {"question_text": "Comment s'appelle la personne qui parle ?", "options": [{"id": "A", "text": "Marie"}, {"id": "B", "text": "Pierre"}, {"id": "C", "text": "Sophie"}, {"id": "D", "text": "Jean"}], "correct_answer": "A"}},
    {"exam_code": "tcf_tp", "section": "maitrise_structures", "question_type": "fill_blank", "difficulty": 0.5, "cefr_level": "B1",
     "content": {"question_text": "Les étudiants ___ (devoir) rendre leur mémoire avant le 30 juin.", "correct_answer": "doivent"}},
    {"exam_code": "tcf_tp", "section": "comprehension_ecrite", "question_type": "mcq", "difficulty": 0.7, "cefr_level": "B2",
     "content": {"passage": "Le Maroc investit massivement dans les énergies renouvelables. Le complexe solaire Noor de Ouarzazate est l'un des plus grands au monde, avec une capacité de 580 MW. Le pays vise 52% d'énergie renouvelable d'ici 2030.", "question_text": "Quel est l'objectif du Maroc en matière d'énergie renouvelable pour 2030 ?", "options": [{"id": "A", "text": "30%"}, {"id": "B", "text": "42%"}, {"id": "C", "text": "52%"}, {"id": "D", "text": "80%"}], "correct_answer": "C"}},
    # Additional TOEFL questions
    {"exam_code": "toefl_ibt", "section": "reading", "question_type": "mcq", "difficulty": 0.5, "cefr_level": "B2",
     "content": {"passage": "Migration patterns of birds have been studied extensively. Many species travel thousands of kilometers between their breeding and wintering grounds. The Arctic Tern holds the record for the longest migration, traveling approximately 70,000 kilometers annually.", "question_text": "How far does the Arctic Tern travel annually?", "options": [{"id": "A", "text": "7,000 km"}, {"id": "B", "text": "17,000 km"}, {"id": "C", "text": "70,000 km"}, {"id": "D", "text": "700,000 km"}], "correct_answer": "C"}},
    {"exam_code": "toefl_ibt", "section": "listening", "question_type": "mcq", "difficulty": 0.7, "cefr_level": "C1",
     "content": {"question_text": "What does the professor imply about the experiment's results?", "options": [{"id": "A", "text": "They confirmed the hypothesis"}, {"id": "B", "text": "They were inconclusive"}, {"id": "C", "text": "They contradicted previous research"}, {"id": "D", "text": "They need further verification"}], "correct_answer": "D"}},
]


async def seed_mongodb():
    """Seed MongoDB collections: career_paths, market_snapshots, question_bank."""
    from app.core.database import get_mongo
    db = get_mongo()

    # Career paths
    existing = await db.career_paths.count_documents({})
    if existing == 0:
        result = await db.career_paths.insert_many(CAREER_PATHS)
        print(f"  ✅ {len(result.inserted_ids)} career paths inserted into MongoDB")
    else:
        print(f"  ⚠️  career_paths already has {existing} docs, skipping")

    # Market snapshots
    existing = await db.market_snapshots.count_documents({})
    if existing == 0:
        result = await db.market_snapshots.insert_many(MARKET_SNAPSHOTS)
        print(f"  ✅ {len(result.inserted_ids)} market snapshots inserted into MongoDB")
    else:
        print(f"  ⚠️  market_snapshots already has {existing} docs, skipping")

    # Question bank
    existing = await db.question_bank.count_documents({})
    if existing == 0:
        result = await db.question_bank.insert_many(QUESTION_BANK)
        print(f"  ✅ {len(result.inserted_ids)} questions inserted into MongoDB")
        # Create indexes
        await db.question_bank.create_index("exam_code")
        await db.question_bank.create_index([("exam_code", 1), ("section", 1)])
        await db.question_bank.create_index("difficulty")
        print("  ✅ MongoDB indexes created")
    else:
        print(f"  ⚠️  question_bank already has {existing} docs, skipping")


if __name__ == "__main__":
    async def full_seed():
        await seed()
        await seed_mongodb()
    asyncio.run(full_seed())
