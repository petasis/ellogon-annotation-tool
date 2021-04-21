import html
from bs4 import BeautifulSoup
import re


def parse_button_response(response_text):
    s = html.unescape(response_text)
    soup = BeautifulSoup(s,features="html.parser")
    mydivs = soup.find_all("div", {"class": "button-widget-header"})
    data_headers = []
    record = {}
    id_numbers = []
    daid=-1
    for h in mydivs:
        # print(h.parent.get("colspan"))
        # print(h.get("title"))
        classes=h.get("class")
        if(len(classes)==1 and classes[0]=="button-widget-header"):
             record = {"id": h.get("id"), "title": h.get("title"), "colspan": h.parent.get("colspan")}
             data_headers.append(record)
             id_number = re.match('.*?([0-9]+)$', h.get("id")).group(1)
             id_numbers.append(int(id_number))
        else:
            if("custom-values" in classes):
                if(h.parent.get("colspan") is None):
                    colspan_attr=mydivs[0].parent.get("colspan")
                else:
                    colspan_attr=h.parent.get("colspan")

                record = {"id": h.get("id"), "title": h.get("title"), "colspan":colspan_attr ,"custom-value-add":True}
                data_headers.append(record)
            else:
                if ("document_attributes" in classes):
                    record = {"id": h.get("id"), "title": h.get("title"), "colspan": h.parent.get("colspan")}
                    data_headers.append(record)
                    daid=len(data_headers)-1
                    id_number = re.match('.*?([0-9]+)$', h.get("id")).group(1)
                    id_numbers.append(int(id_number))

    try:
        col_total = int(mydivs[0].parent.get("colspan"))
    except:
        col_total = 0
    # print(data_headers)
    print(id_numbers)
    elem_counts = [x - id_numbers[i - 1] - 1 for i, x in enumerate(id_numbers)][1:]
    # print(elem_counts)
    # print(sum(elem_counts))
    # items_count = sum(elem_counts)
    mybuttons = soup.find_all("annotation-button")
    buttons_count = len(mybuttons)
    annotation_dateentry = soup.find_all("annotation-dateentry")
    annotation_entries = soup.find_all("annotation-entry")
    annotation_comboboxes = soup.find_all("annotation-combobox")
    annotation_text_labels = soup.find_all("annotation-text-label")

    subheaders = []
    for s in annotation_text_labels:
        brecord = {"id": s.get("id"), "title": s.get("title"), "colspan": s.parent.get("colspan"), "type": "annotation-text-label"}
        subheaders.append(brecord)
    annotation_text_text = soup.find_all("annotation-text-text")
    dtable=[]
    for i in range(len(annotation_text_text)):
        brecord = {"type": "document-attribute-table", "rows": []}
        brecord["rows"].append(subheaders[i])
        row = {"document_attribute": True,"title":annotation_text_text[i].get("annotation-value")}
        brecord["rows"].append(row)
        dtable.append(brecord)


    components = []
    for i in range(buttons_count):
        idx = re.match('.*?([0-9]+)$', mybuttons[i].get("id")).group(1)
        labelk=(mybuttons[i].get("label"))
        x = labelk.replace('\\n','')
        labelk=""
        for item in x:
            labelk=labelk+" "+item
        brecord = {"id": int(idx), "title": mybuttons[i].get("button-tooltip"), "label": labelk,
                   "color": mybuttons[i].get("bg-color"), "type": "annotation-button",
                   "colspan": mybuttons[i].parent.get("colspan")}
        components.append(brecord)
    for item in annotation_dateentry:
        idx = re.match('.*?([0-9]+)$', item.get("id")).group(1)
        brecord = {"id": int(idx), "annotation_type": "sync3_event", "annotation_attribute": "date",
                   "dateentry_format": "%m/%d/%Y 00:00:00 GMT", "type": "annotation-dateentry",
                   "colspan": item.parent.get("colspan")}
        components.append(brecord)
    for item in annotation_entries:
        idx = re.match('.*?([0-9]+)$', item.get("id")).group(1)
        brecord = {"id": int(idx), "type": "annotation-entry", "colspan": item.parent.get("colspan")}
        components.append(brecord)
    for item in annotation_comboboxes:
        idx = re.match('.*?([0-9]+)$', item.get("id")).group(1)
        brecord = {"id": int(idx), "type": "annotation-combobox", "colspan": item.parent.get("colspan")}
        components.append(brecord)





    sorted_components = sorted(components, key=lambda k: k['id'])
    brecord = {}
    row = []
    groupcount = 0
    colcount = 0
    group_index = 0
    rows = []
    #print(elem_counts)
    for item in sorted_components:

        row.append(item)

        groupcount = groupcount + 1
        if (item["colspan"] is None):
            colcount = colcount + 1
        else:
            colcount = colcount + int(item["colspan"])
        if (groupcount == elem_counts[group_index]):
            # print(row)
            if (len(row) > 0):
                rows.append(row)

            data_headers[group_index]["rows"] = rows
            rows = []
            row = []
            groupcount = 0
            colcount = 0
            group_index = group_index + 1
        if (colcount == col_total):
            rows.append(row)
            row = []
            colcount = 0


    # print(len(data_headers))
    # print(len(elem_counts))
    try:
        data_headers[len(elem_counts)]["rows"] = []
        if(daid!=-1):
            data_headers[daid]["rows"]=dtable
    except IndexError:

            record= {"id": 0, "title": "►", "colspan":"5"}
            data_headers.append(record)
            record = {"id": 1, "title": " ►  Found in Collection", "colspan": "5"}
            data_headers.append(record)
    # for r in data_headers:
    #     #     print(r)
    #     print(r["title"])
    #     print(r["rows"])
    #     print("\n\n")
    return data_headers


def parse_button_relation_response(response_text):
    s = html.unescape(response_text)
    # print(s)#?
    # s = s.replace('"""', '"double-quote"')
    # s1 = '''"Εισαγωγικα (", ', «, »)"'''
    # s2 = '''"Εισαγωγικα (double-quote, ', «, »)"'''
    # s = s.replace(s1, s2)
    # s = s.replace("&", "+")  # greek,name,type
    soup = BeautifulSoup(s,features="html.parser")
    mydivs = soup.find_all("div", {"class": "button-widget-header"})
    group_headers = []
    argument_headers = []
    for h in mydivs:
        id_number = h.get("id")
        record = {"id": h.get("id"), "title": h.get("title"), "colspan": h.parent.get("colspan")}
        if (id_number.startswith("x_group")):
            group_headers.append(record)
        else:
            argument_headers.append(record)

    # print(group_headers)
    # print(argument_headers)
    mybuttons = soup.find_all("annotation-button")
    buttons_count = len(mybuttons)
    components = []
    # annotation buttons
    for i in range(buttons_count):
        idx = re.match('.*?([0-9]+)$', mybuttons[i].get("id")).group(1)
        brecord = {"id": int(idx), "title": mybuttons[i].get("button-tooltip"), "label": mybuttons[i].get("label"),
                   "color": mybuttons[i].get("bg-color"), "type": "annotation-button",
                   "colspan": mybuttons[i].parent.get("colspan")}
        components.append(brecord)

    subs = soup.find_all("annotation-relation")
    subheaders = []
    for s in subs:
        brecord = {"title": s.get("title"), "type": "annotation-relation"}
        subheaders.append(brecord)
    # print(subheaders)

    # myrelation_comboboxes=subs = soup.find_all("relation-combobox")
    # myrelation_=subs = soup.find_all("relation-annotate-btn")

    myrelations = soup.find_all("div", {"class": "button-widget-relation"})
    relation_tables = []
    for i in range(len(myrelations)):
        brecord = {"type": "annotation-relation_table", "rows": []}
        brecord["rows"].append(subheaders[i])
        row = {"argument_header": argument_headers[2 * i], "combobox": True}
        brecord["rows"].append(row)
        row = {"argument_header": argument_headers[2 * i + 1], "combobox": True}
        brecord["rows"].append(row)
        row = {"annotate_btn": True, "clear_btn": True}
        brecord["rows"].append(row)
        relation_tables.append(brecord)
    brecord = {}
    row = []
    colcount = 0
    rows = []
    col_total = int(mydivs[0].parent.get("colspan"))
    for i in range(buttons_count):
        idx = re.match('.*?([0-9]+)$', mybuttons[i].get("id")).group(1)
        brecord = {"id": int(idx), "title": mybuttons[i].get("button-tooltip"), "label": mybuttons[i].get("label"),
                   "color": mybuttons[i].get("bg-color"), "type": "annotation-button",
                   "colspan": mybuttons[i].parent.get("colspan")}
        row.append(brecord)
        colcount = colcount + 1
        if (colcount == col_total):
            rows.append(row)
            row = []
            colcount = 0
    if(len(row)>0):
        rows.append(row)
    group_headers[0]["rows"] = rows
    for j in range(1, len(group_headers) - 1):
        rows = [relation_tables[2 * j - 2], relation_tables[2 * j - 1]]
        group_headers[j]["rows"] = rows
    group_headers[3]["rows"] = []
    return group_headers
    # for r in group_headers:
    #     print(r["title"])
    #     print(r["rows"])
    #     print("\n\n")

def calculate_code(r, p):
    if p["language"] == "greek" and p["annotation"] == "polarity" and p["alternative"] == "NOMAD":
        return 0
    elif p["language"] == "greek" and p["annotation"] == "argument" and p["alternative"] == "Mandenaki":
        return 1
    elif p["language"] == "english":
        return 2
    elif p["language"] == "EN-EL" and p["annotation"] == "translation" and p["alternative"] == "Aligned":
        return 3
    elif p["language"] == "igbo":
        return 4
    elif p["language"] == "neutral" and p["annotation"] == "character" and p["alternative"] == "NCSR":
        return 5
    elif p["language"] == "neutral" and p["annotation"] == "argument+polarity" and p["alternative"] == "NOMAD":
        return 6
    elif p["language"] == "neutral" and p["annotation"] == "argument+polarity" and p["alternative"] == "Simple":
        return 7
    elif p["language"] == "neutral" and p["annotation"] == "polarity" and p["alternative"] == "NOMAD":
        return 8
    elif p["language"] == "neutral" and p["annotation"] == "aspect+polarity" and p["alternative"] == "Generic":
        return 9
    elif p["language"] == "neutral" and p["annotation"] == "aspect+polarity" and p["alternative"] == "Games":
        return 10
    else:
        return -1


def parsecorefresponse(r,p):
    c = calculate_code(r, p)
    if (c == 0):
        header_titles = ["Attribute", "Text", "Start", "End"]
        rows = []
        items = []
        subheaders = ["Opinion Scope:", "Opinion:", "Polarity:", "Argument", "Type:"]
        options = [["Positive", "Neutral", "Negative"],
                   ["Example", "Counter Example", "Analogy", "Reference to Authority"]]

        sj = 0
        sp = 0
        for j in range(0, 7):

            if (j == 0):
                for i in range(len(header_titles)):
                    items.append({"type": "corefheader", "title": header_titles[i],"cols": 1})
                    # rows.append({"rowid": j, "items": items})
            elif (j == 1 or j == 2 or j == 4):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[sj], "cols": 1},
                     {"type": "corefsegmententry", "cols": 1},
                     {"type": "corefspan","class":"form-control coref-span-start","cols":1},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":1}, {"type": "add_btn", "row": 1}, {"type": "del_btn", "row": 1}])
                sj = sj + 1
            elif (j == 3 or j == 5):
                items = []
                items.extend([{"type": "subheader", "title": subheaders[sj], "cols": 1},
                              {"type": "corefcombobox", "cols": 4, "options": options[sp]}])
                sp = sp + 1
                sj = sj + 1
            else:
                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})


    elif c == 1:
        header_titles = ["Attribute", "Text", "Start", "End", "Argument", "Polarity", "Stance"]
        rows = []
        items = []
        subheaders = ["Ισχυρισμός", "Προκειμενη ", "Τύπος ", "Ενέργεια "]
        n = 1
        types = ["Προκείμενη", "Προκείμενη με στοιχεία", "Προκείμενη με επίκληση στην αυθεντία",
                 "Προκείμενη με παράδειγμα",
                 "Προκείμενη Petitio Principia", "Προκείμενη με απειλή", "Προκείμενη Ad Hominem"]
        k = 2

        polarity_colors = [["#FF0000", "#DC0000", "#B80000", "#940000", "#700000"],
                           ["yellow"], ["#007000", "#009400", "#00B800", "#00DC00", "#00FF00"]]
        polarity_labels = [[], [], []]
        for l in range(-5, 6):
            if (l < 0):
                polarity_labels[0].append(str(l))
            elif (l == 0):
                polarity_labels[1].append(str(l))
            else:
                polarity_labels[2].append(str(l))

        for j in range(0, 31):

            if (j == 0):
                for i in range(len(header_titles) - 3):

                     items.append({"type": "corefheader", "title": header_titles[i],"cols": 1})
            elif (j == 1):

                items = []
                items.append({"type": "header", "title": header_titles[len(header_titles) - 3], "colspan": 6})

            elif (j == 2):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[0], "cols": 2}, {"type": "corefspan","class":"form-control coref-span-start","cols":1},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":2},
                     {"type": "add_btn", "row": 2}, {"type": "del_btn", "row": 2}])
            elif (j == 3 or j == 5 or j == 9 or j == 13 or j == 17 or j == 21 or j == 25):
                items = []
                items.append({"type": "corefsegmententry", "cols": 12})
            elif (j == 4 or j == 8 or j == 12 or j == 16 or j == 20 or j == 24):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[1] + str(n), "cols": 2}, {"type": "corefspan","class":"form-control coref-span-start","cols":1},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":1}, {"type": "add_btn", "row": 2}, {"type": "del_btn", "row": 2}])
            elif (j == 6 or j == 10 or j == 14 or j == 18 or j == 22 or j == 26):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[2] + str(n), "cols": 1},
                     {"type": "corefcombobox", "cols": 4, "options": types}])
            elif (j == 7 or j == 11 or j == 15 or j == 19 or j == 23 or j == 27):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[3] + str(n), "cols": 1},
                     {"type": "table", "cols": 1,
                      "elements":[ [{"type": "corefbutton", "title": "Supports", "label": "Supports", "color": "green"},
                                   {"type": "corefbutton", "title": "Attacks", "label": "Attacks",
                                    "color": "red"}]]
                      }])
                n = n + 1
            elif (j == 28 or j == 29):

                items = []
                elements = []
                itemrow = []
                for l1 in range(len(polarity_colors)):
                    print(len(polarity_colors[l1]))
                    for l2 in range(len(polarity_colors[l1])):
                        itemrow.append(
                            {"type": "corefbutton", "title": polarity_labels[l1][l2], "label": polarity_labels[l1][l2],
                             "color": polarity_colors[l1][l2]})
                        print(str(l1) + "," + str(l2))
                    elements.append(itemrow)
                    itemrow = []
                items.extend(
                    [{"type": "header", "title": header_titles[len(header_titles) - k], "cols": 7},
                     {"type": "table", "cols": 1,
                      "elements": elements}])
                k = k - 1
            else:

                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})

    elif c == 2:
        header_titles = ["Attribute", "Text", "Start", "End", "Argument"]
        polarity_labels = []
        items = []
        rows = []
        subheaders = ["The type of the annotation", "The pos of the annotation", ""]
        for l in range(-5, 6):
            polarity_labels.append(str(l))
        polarity_labels.extend(["but", "not"])
        options = [["Nominal", "General", "Accusative", "Vocal"],
                   ["descr 1", "descr 2", "Person's name", "Person's age", "Sport or athlete gender",
                    "Person's nationality", "Person's performance", "Person's ranking", "Sport's name",
                    "Stadium's name",
                    "Round's name", "Heat's name", "Event's name", "Event's country", "Date expression", "City",
                    "Person",
                    "Organisation", "Location", "Person & Organisation", "Location & Organisation", "What", "What2",
                    "Who",
                    "To Whom", "Date of Publish", "Predicate", "When + Date", "Where + Country",
                    "Reporter Location + Country", "Main Segment + Event + IPTC Codes",
                    "Secondary Segment + Event + IPTC Codes", "Positive", "Neutral", "Negative", "What", "Who",
                    "Where + Country", "Date of Publish", "Predicate", "To Whom", "When + Date", "News Item", "Sport",
                    "Athlete's Biography", "Column", "Main Column", "Left Column", "Right Column", "Table",
                    "Table Column",
                    "Table Row",
                    "Title", "Image Caption", "Header", "Footer", "Paragraph", "Sentence", "Other Region"]
            , ["descr 1", "descr 2"], polarity_labels]
        for j in range(0, 10):
            if (j == 0):
                for i in range(len(header_titles)):
                    items.append({"type": "corefheader", "title": header_titles[i],"cols": 1})
            elif (j == 1):
                items = []
                items.extend([{"type": "subheader", "title": subheaders[2], "cols": 1},
                              {"type": "corefcombobox", "cols": 4, "options": options[0]}])
            elif (j == 2 or j == 4 or j == 5 or j == 6 or j == 7):
                items = []
                items.extend([{"type": "subheader", "title": subheaders[0], "cols": 1},
                              {"type": "corefcombobox", "cols": 4, "options": options[1]}])
            elif (j == 3):
                items = []
                items.extend([{"type": "subheader", "title": subheaders[1], "cols": 1},
                              {"type": "corefcombobox", "cols": 4, "options": options[2]}])
            elif (j == 8):
                items = []
                items.extend([{"type": "subheader", "title": subheaders[2], "cols": 1},
                              {"type": "corefcombobox", "cols": 4, "options": options[3]}])
            else:
                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})

    elif c == 3:
        start_header_titles = ["Attribute", "Text", "Start", "End"]
        header_titles = ["► TT ADDITION", "► CONTEXT"]
        rows = []
        items = []
        subheaders = ["ST EN", "ST EN Expression", "ST Rhetorical Relation", "ST Category",
                      "ST Phrase-level Connection",
                      "ST Position", "TT EL", "TT EL Expression", "TT Rhetorical Relation", "Omission", " TT Category",
                      "TT Phrase-level Connection", "TT Position", "ST Comment", "TT Comment", "TT Rendering of",
                      "TT Analysis/Rendering of Text/Expression", "ST Clue for Additional TT EL",
                      "TT Comments", "ST Comments", "ST Verb", "ST Adjective", "ST Adverb", "ST Other", "ST More",
                      "ST Less", "TT Verb", "TT Adjective", "TT Adverb", "TT Other", "TT More", "TT Less",
                      "Compensation"]
        options = [["Addition", "Contrast/Concession", "Other", "0"],
                   ["Coordinator", "Correlative Coordinator", "Subordinator", "Linking Adverbial", "Linking Expression",
                    "Other"],
                   ["Initial", "Near Initial", "Middle", "Near End", "End"],
                   ["Coordinator", "Correlative Coordinator", "Subordinator", "Linking Adverbial", "Linking Expression",
                    "Punctuation", "Other"],
                   ["ST Clause (Main)", "ST Clause (Subordinate)", "ST Idiomatic Expression",
                    "ST Expression / Collocation",
                    "Figurative Language", "ST Adjective", "ST Adverb", "ST Adverbial Phrase", "ST Noun Phrase",
                    "ST Participle", "ST Punctuation", "ST Connective", "ST Marker", 0]
                   ]
        checkboxes = ["(st_phrase_level_connection)", "(tt_omission)", "(tt_phrase_level_connection)",
                      "(add_tt_phrase_level_connection)", "(st_more)", "(st_less)", "(tt_more)", "tt_less)",
                      "(compensation)"]
        sj = 0
        sp = 0
        sc = 0
        sh = 0
        # j=23
        for j in range(0, 43):
            if (j == 0):
                for i in range(len(start_header_titles)):
                    items.append({"type": "corefheader", "title": start_header_titles[i],"cols":1})
            elif (j == 1 or j == 7 or j == 17 or j == 25 or (j > 28 and j < 33) or (j > 34 and j < 39)):
                if (j == 17):
                    sj = 6
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[sj], "cols": 1},
                     {"type": "corefsegmententry", "cols": 1},
                     {"type": "corefspan","class":"form-control coref-span-start","cols":2},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":2},
                     {"type": "add_btn", "row": 1}, {"type": "del_btn", "row": 1}])
                sj = sj + 1
            elif (j == 2 or j == 8 or j == 14 or j == 15 or j == 18 or j == 24 or j == 26 or j == 27):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[sj], "cols": 1}, {"type": "corefentry", "cols": 5}])
                sj = sj + 1
            elif (
                    j == 3 or j == 4 or j == 6 or j == 9 or j == 11 or j == 13 or j == 19 or j == 20 or j == 22 or j == 23):
                if (j == 9 or j == 19):
                    sp = 0
                if (j == 11):
                    sp = 3
                if (j == 13):
                    sp = 2
                items = []
                items.extend([{"type": "subheader", "title": subheaders[sj], "cols": 1},
                              {"type": "corefcombobox", "cols": 4, "options": options[sp]}])
                sj = sj + 1
                if j == 19:
                    sj = sj + 1
                if j == 22:
                    sj = sj + 2
                    sp = sp + 2
                if j < 9 or j == 19 or j == 20:
                    sp = sp + 1
            elif (j == 5 or j == 10 or j == 12 or j == 21 or j == 33 or j == 34 or (j > 38 and j < 42)):
                items = []
                items.extend([{"type": "subheader", "title": subheaders[sj], "cols": 1},
                              {"type": "corefcheckbox", "cols": 5, "checkbox_tag": checkboxes[sc]}])
                sj = sj + 1
                sc = sc + 1
            elif (j == 16 or j == 28):
                items = []
                items.append({"type": "header", "title": header_titles[sh], "colspan": 6})
                sh = sh + 1
            else:
                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})



    elif c == 4:
        header_titles = ["Attribute", "Text", "Start", "End", "Argument"]
        options = ["Inherent Complement Verb", "Compound Verb", "Auxiliary Verb", "Negative Auxiliary",
                   "Conjunctional Verb", "Prepositional Verb", "Infinitive Verb", "Verb", "Personal Pronoun Singular",
                   "Personal Pronoun Plural", "Possessive Pronoun Singular", "Possessive Pronoun Plural",
                   "Reflexive Pronoun Singular", "Reflexive Pronoun Plural", "Interrogative Pronoun",
                   "Indefinite Pronoun Singular", "Indefinite Pronoun Plural", "Relative Pronoun Singular",
                   "Relative Pronoun Singular", "Proper Noun", "Common Noun", "Adjectival Noun", "Adverbial Noun",
                   "Bound Verb Complement", "Inherent Complement", "Gerund,Agentive Nominal", "Instrumental Nominal",
                   "Ideophone", "Prepositional Suffixes", "-rV-Suffix", "-oV-Suffix", "Prefix", "Negative Suffix",
                   "Modal Suffix", "Inflectional Suffix", "Extensional Suffix", "Subordinating Conjunction",
                   "Co-ordinating Conjunction", "Dependent Interrogative", "Independent Interrogative",
                   "Particle,Preposition", "Determiner", "Numeral", "Adjective,Adverb", "Interjection", "Enclitic",
                   "Foreign Word", "Quantifier"]
        items = []
        rows = []
        for j in range(0, 3):
            if (j == 0):
                for i in range(len(header_titles)):
                    items.append({"type": "corefheader", "title": header_titles[i],"cols":1})
            elif (j == 1):
                items = []
                items.extend([{"type": "subheader", "title": "Morphological Tagset for the Tokens", "cols": 1},
                              {"type": "corefcombobox", "cols": 4, "options": options}])
            else:
                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})
        for row in rows:
            print(row)
    elif c == 5:
        start_header_titles = ["Attribute", "Text", "Start", "End"]
        header_title = "► Segments"
        subheaders = ["Character:", "Character Role:"]
        items = []
        rows = []
        sj = 0
        for u in range(1, 11):
            subheaders.append("Segment" + str(u))
            images = [[{"title": "positive"}, {"title": "negative"}, {"title": "neutral"}]]
        corefbuttons = [[
            {'type': 'corefbutton',"label": "protagonist","title": "protagonist", "color": "#a6e22d"}, {'type': 'corefbutton',"label": "antagonist","title": "antagonist", "color": "#43c6fc"},
            {'type': 'corefbutton',"label": "minor","title": "minor", "color": "#2fbbab"}
        ]]
        for j in range(0, 15):
            if (j == 0):
                for i in range(len(start_header_titles)):
                    items.append({"type": "corefheader", "title": start_header_titles[i],"cols":1})
            elif (j == 1 or (j > 3 and j < 14)):
                items = []
                elements = []
                itemrow = []
                for l1 in range(len(images)):

                    for l2 in range(len(images[l1])):
                        itemrow.append(
                            {"type": "corefimagebutton", "title": images[l1][l2]["title"]})

                    elements.append(itemrow)
                    itemrow = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[sj], "cols": 1},
                     {"type": "corefsegmententry", "cols": 1},
                     {"type": "corefspan","class":"form-control coref-span-start"},
                     {"type": "corefspan","class":"form-control coref-span-end"},
                     {"type": "add_btn", "row": 1}, {"type": "del_btn", "row": 1},
                     {"type": "table", "cols": 1,
                      "elements": elements}

                     ])
                sj = sj + 1
            elif (j == 2):
                items = []
                elements = []
                itemrow = []
                for l1 in range(len(corefbuttons)):
                    for l2 in range(len(corefbuttons[l1])):
                        itemrow.append(corefbuttons[l1][l2])
                    elements.append(itemrow)

                items.extend([{"type": "subheader", "title": subheaders[sj], "colspan": 1}, {"type": "table", "cols": 1,
                                                                                             "elements": elements}])
                sj = sj + 1
            elif (j == 3):
                items = []
                items.append({"type": "header", "title": "Segments", "colspan": 6})
            else:
                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})



    elif c == 6:
        start_header_titles = ["Attribute", "Text", "Start", "End"]
        header_titles = ["►  Argument", "Polarity", "► Argument Entities"]
        subheaders = ["Claim:", "Support:", "Model Argument:", "Entity 1:", "Entity 2:", "Entity 3:"]
        items = []
        rows = []
        c0 = 0
        sj = 0
        polarity_colors = [["#FF0000", "#DC0000", "#B80000", "#940000", "#700000"],
                           ["yellow"], ["#007000", "#009400", "#00B800", "#00DC00", "#00FF00"]]
        polarity_labels = [[], [], []]
        for l in range(-5, 6):
            if (l < 0):
                polarity_labels[0].append(str(l))
            elif (l == 0):
                polarity_labels[1].append(str(l))
            else:
                polarity_labels[2].append(str(l))
        for j in range(0, 13):
            if (j == 0):
                for i in range(len(start_header_titles)):
                    items.append({"type": "corefheader", "title": start_header_titles[i],"cols":1})
            elif (j == 1 or j == 8):
                items = []

                items.append({"type": "header", "title": header_titles[c0], "colspan": 6})
                c0 = c0 + 1
            elif (j == 2 or j == 4):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[sj], "cols": 2},
                     {"type": "corefspan","class":"form-control coref-span-start","cols":2},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":2},
                     {"type": "add_btn", "row": 2}, {"type": "del_btn", "row": 2}])
                sj = sj + 1
            elif (j == 3 or j == 5):
                items = []
                items.append({"type": "corefsegmententry", "cols": 4})
            elif (j == 6):
                items = []
                items.extend([{"type": "subheader", "title": subheaders[sj], "cols": 1},
                              {"type": "corefcombobox", "cols": 4, "options": []}])
                sj = sj + 1
            elif (j == 7):
                items = []
                elements = []
                itemrow = []
                for l1 in range(len(polarity_colors)):

                    for l2 in range(len(polarity_colors[l1])):
                        itemrow.append(
                            {"type": "corefbutton", "title": polarity_labels[l1][l2], "label": polarity_labels[l1][l2],
                             "color": polarity_colors[l1][l2]})

                    elements.append(itemrow)
                    itemrow = []
                items.extend(
                    [{"type": "header", "title": header_titles[c0], "cols": 6},
                     {"type": "table", "cols": 2,
                      "elements": elements}])
                c0 = c0 + 1

            elif (j > 8 and j < 12):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[sj], "cols": 1},
                     {"type": "corefsegmententry", "cols": 1},
                     {"type": "corefspan","class":"form-control coref-span-start","cols":2},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":2},
                     {"type": "add_btn", "row": 1}, {"type": "del_btn", "row": 1}])
                sj = sj + 1
            else:
                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})


    elif c == 7:
        start_header_titles = ["Attribute", "Text", "Start", "End"]
        header_titles = ["►  Argument", "Polarity", "► Argument Entities"]
        subheaders = ["Claim:", "Support 1:", "Support 2:", "Support 3:", "Entity 1:", "Entity 2:", "Entity 3:"]
        items = []
        rows = []
        c0 = 0
        sj = 0
        polarity_colors = [["#FF0000", "#DC0000", "#B80000", "#940000", "#700000"],
                           ["yellow"], ["#007000", "#009400", "#00B800", "#00DC00", "#00FF00"]]
        polarity_labels = [[], [], []]
        for l in range(-5, 6):
            if (l < 0):
                polarity_labels[0].append(str(l))
            elif (l == 0):
                polarity_labels[1].append(str(l))
            else:
                polarity_labels[2].append(str(l))
        for j in range(0, 16):
            if (j == 0):
                for i in range(len(start_header_titles)):
                    items.append({"type": "corefheader", "title": start_header_titles[i],"cols":1})
            elif (j == 1 or j == 11):
                items = []

                items.append({"type": "header", "title": header_titles[c0], "colspan": 6})
                c0 = c0 + 1
            elif (j == 2 or j == 4 or j == 6 or j == 8):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[sj], "cols": 2},
                     {"type": "corefspan","class":"form-control coref-span-start","cols":1},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":1},
                     {"type": "add_btn", "row": 2}, {"type": "del_btn", "row": 2}])
                sj = sj + 1
            elif (j == 3 or j == 5 or j == 7 or j == 9):
                items = []
                items.append({"type": "corefsegmententry", "cols": 4})
            elif (j == 10):
                items = []
                elements = []
                itemrow = []
                for l1 in range(len(polarity_colors)):

                    for l2 in range(len(polarity_colors[l1])):
                        itemrow.append(
                            {"type": "corefbutton", "title": polarity_labels[l1][l2], "label": polarity_labels[l1][l2],
                             "color": polarity_colors[l1][l2]})

                    elements.append(itemrow)
                    itemrow = []
                items.extend(
                    [{"type": "header", "title": header_titles[c0], "cols": 7},
                     {"type": "table", "cols": 1,
                      "elements": elements}])
                c0 = c0 + 1

            elif (j > 11 and j < 15):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[sj], "cols": 1},
                     {"type": "corefsegmententry", "cols": 1},
                     {"type": "corefspan","class":"form-control coref-span-start"},
                     {"type": "corefspan","class":"form-control coref-span-end"},
                     {"type": "add_btn", "row": 1}, {"type": "del_btn", "row": 1}])
                sj = sj + 1
            else:
                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})

    elif c == 8:
        start_header_titles = ["Attribute", "Text", "Start", "End"]
        header_titles = ["► Opinion", "► Argument"]
        subheaders = ["Opinion Scope:", "Opinion Target:", "Target Type:", "Opinion", "Opinion Type", "Polarity",
                      "Argument:", "Type:"]
        c0 = 0
        sj = 0
        sc = 0
        items = []
        rows = []
        options = [
            ["Law", "Location", "Organization", "Person", "Other"],
            ["Comment", "Proposal"],
            ["Positive", "Neutral", "Negative"], ["Example", "Counter Example", "Analogy""Reference to Authority"]]
        for j in range(0, 12):
            if (j == 0):
                for i in range(len(start_header_titles)):
                    items.append({"type": "corefheader", "title": start_header_titles[i],"cols":1})
            elif (j == 1 or j == 8):
                items = []
                items.append({"type": "header", "title": header_titles[c0], "colspan": 6})
                c0 = c0 + 1
            elif (j == 2 or j == 5 or j == 9):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[sj], "cols": 1}, {"type": "corefmultitentry", "cols": 1},
                     {"type": "corefspan","class":"form-control coref-span-start","cols":1},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":1},
                     {"type": "add_btn", "row": 1}, {"type": "del_btn", "row": 1}])
                sj = sj + 1
            elif (j == 3):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheaders[sj], "cols": 1},
                     {"type": "corefsegmententry", "cols": 1},
                     {"type": "corefspan","class":"form-control coref-span-start","cols":1},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":1},
                     {"type": "add_btn", "row": 1}, {"type": "del_btn", "row": 1}])
                sj = sj + 1
            elif (j == 4 or j == 6 or j == 7 or j == 10):
                items = []
                items.extend([{"type": "subheader", "title": subheaders[sj], "cols": 1},
                              {"type": "corefcombobox", "cols": 4, "options": options[sc]}])
                sj = sj + 1
                sc = sc + 1
            else:
                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})


    elif c == 9:
        start_header_titles = ["Attribute", "Text", "Start", "End"]
        header_title = "Polarity"
        subheader = "Aspect"
        items = []
        rows = []
        polarities = [[{"type": "corefbutton", "label": "Positive", "color": "#007000"}, {"type": "corefbutton", "label": "Neutral", "color": "#700000"},
                       {"type": "corefbutton", "label": "Negative", "color": "yellow"}]]
        for j in range(0, 4):
            if (j == 0):
                for i in range(len(start_header_titles)):
                    items.append({"type": "corefheader", "title": start_header_titles[i],"cols":1})
            elif (j == 1):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheader, "cols": 1}, {"type": "corefsegmententry", "cols": 1},
                     {"type": "corefspan","class":"form-control coref-span-start","cols":1},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":1},
                     {"type": "add_btn", "row": 1}, {"type": "del_btn", "row": 1}])
            elif (j == 2):
                items = []
                elements = []
                itemrows = []
                for l1 in range(len(polarities)):
                    for l2 in range(len(polarities[l1])):
                        itemrows.append(polarities[l1][l2])
                    elements.append(itemrows)
                    itemrows = []

                items.extend([{"type": "header", "title": header_title, "colspan": 7}, {"type": "table", "cols": 1,
                                                                                        "elements": elements}])
            else:
                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})



    elif c == 10:
        start_header_titles = ["Attribute", "Text", "Start", "End"]
        header_titles = ["Aspect", "Polarity"]
        subheader = "Aspect"
        items = []
        rows = []
        c0 = 0
        aspects = [[{"type": "corefbutton", "label": "Gameplay", "color": "#a6e22d"}, {"type": "corefbutton", "label": "General", "color": "#43c6fc"},
                    {"type": "corefbutton", "label": "Graphics", "color": "#2fbbab"}, {"type": "corefbutton", "label": "Music", "color": "#0000ff"}],
                   [{"type": "corefbutton", "label": "Replayability", "color": "#a52a2a"}, {"type": "corefbutton", "label": "Story", "color": "#a020f0"},
                    {"type": "corefbutton", "label": "Other", "color": "#ff0000"}
                       , {"type": "corefbutton","label": "Polarity Segment", "color": "#ffc0cd"}]]
        polarities = [[{"type": "corefbutton", "label": "Positive", "color": "#007000"}, {"type": "corefbutton", "label": "Neutral", "color": "#700000"},
                       {"type": "corefbutton", "label": "Negative", "color": "yellow"}]]
        for j in range(0, 4):
            if (j == 0):
                for i in range(len(start_header_titles)):
                    items.append({"type": "corefheader", "title": start_header_titles[i]})
            elif (j == 1):
                items = []
                items.extend(
                    [{"type": "subheader", "title": subheader, "cols": 1}, {"type": "corefsegmententry", "cols": 1},
                     {"type": "corefspan","class":"form-control coref-span-start","cols":1},
                     {"type": "corefspan","class":"form-control coref-span-end","cols":1},
                     {"type": "add_btn", "row": 1}, {"type": "del_btn", "row": 1}])
            elif (j == 2 or j == 3):
                items = []
                elements = []
                if (j == 2):
                    data_fields = aspects
                else:
                    data_fields = polarities
                itemrows = []
                for l1 in range(len(data_fields)):
                    for l2 in range(len(data_fields[l1])):
                        itemrows.append(data_fields[l1][l2])
                    elements.append(itemrows)
                    itemrows = []
                items.extend([{"type": "header", "title": header_titles[c0], "colspan": 7}, {"type": "table", "cols": 3,
                                                                                             "elements": elements}])
                c0=c0+1
            else:
                items = []
                items.extend([{"type": "annotate_btn"}, {"type": "clear_btn"}])
            rows.append({"rowid": j, "items": items})
    else:
        rows = []

    return rows