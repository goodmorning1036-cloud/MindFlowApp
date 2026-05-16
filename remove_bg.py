from PIL import Image

def remove_white_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    # threshold for 'white'
    for item in datas:
        if item[0] > 220 and item[1] > 220 and item[2] > 220:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

remove_white_bg("/Users/mariam/.gemini/antigravity/brain/218d4b99-55b2-48e1-8417-0124efc13914/supercar_realistic_1778323480804.png", "/Users/mariam/Desktop/MindFlowApp/public/supercar.png")
print("Done")
