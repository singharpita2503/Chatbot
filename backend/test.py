from indicnlp.tokenize import indic_tokenize  

text = "मेरा नाम लड्डू है।"
tokens = list(indic_tokenize.trivial_tokenize(text, lang='hi'))
print(tokens)
