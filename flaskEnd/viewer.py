from PIL import Image, ImageTk, ImageFilter
import tkinter as tk
from tkinter import filedialog, simpledialog, messagebox

class ImageViewer:
    def _init_(self):
        self.root = tk.Tk()
        self.root.state('zoomed')
        self.canvas = tk.Canvas(self.root)
        self.canvas.pack(expand=True, fill=tk.BOTH)

        # Add button frame
        self.button_frame = tk.Frame(self.root)
        self.button_frame.pack(pady=10)

        # Toggle view mode button (password-protected)
        self.toggle_button = tk.Button(self.button_frame, text="Toggle View Mode", command=self.prompt_password)
        self.toggle_button.grid(row=0, column=0, padx=5)

        # Zoom in and zoom out buttons
        self.zoom_in_button = tk.Button(self.button_frame, text="Zoom In", command=self.zoom_in)
        self.zoom_in_button.grid(row=0, column=1, padx=5)
        
        self.zoom_out_button = tk.Button(self.button_frame, text="Zoom Out", command=self.zoom_out)
        self.zoom_out_button.grid(row=0, column=2, padx=5)

        self.root.after(100, self.open_file_dialog)

        # Bind mouse motion to unblur area around the cursor
        self.canvas.bind("<Motion>", self.unblur_area)
        # Bind mouse wheel for zoom in/out
        self.canvas.bind("<MouseWheel>", self.zoom_image)

        self.original_image = None
        self.display_image = None
        self.scale = 1.0
        self.image_id = None
        self.blur_enabled = True

        self.root.mainloop()

    def open_file_dialog(self):
        self.image_path = filedialog.askopenfilename(filetypes=[("Image files", ".png;.jpg;.jpeg;.bmp")])
        if self.image_path:
            self.original_image = Image.open(self.image_path)
            self.resize_image_to_fit()
            self.update_display_image()

            self.image_tk = ImageTk.PhotoImage(self.display_image)
            self.image_id = self.canvas.create_image(0, 0, anchor=tk.NW, image=self.image_tk)
            self.canvas.config(scrollregion=self.canvas.bbox(tk.ALL))

    def resize_image_to_fit(self):
        window_width = self.root.winfo_width()
        window_height = self.root.winfo_height()
        if self.original_image:
            img_width, img_height = self.original_image.size
            scale_factor = min(window_width / img_width, window_height / img_height)
            new_width = int(img_width * scale_factor)
            new_height = int(img_height * scale_factor)
            self.original_image = self.original_image.resize((new_width, new_height), Image.Resampling.LANCZOS)

    def update_display_image(self):
        if self.blur_enabled:
            self.blurred_image = self.original_image.filter(ImageFilter.GaussianBlur(10))
            self.display_image = self.blurred_image
        else:
            self.display_image = self.original_image

    def unblur_area(self, event):
        if not self.blur_enabled or not self.blurred_image:
            return

        x, y = event.x, event.y
        scaled_x = int(x / self.scale)
        scaled_y = int(y / self.scale)
        unblur_radius = int(50 / self.scale)
        left = max(0, scaled_x - unblur_radius)
        top = max(0, scaled_y - unblur_radius)
        right = min(self.display_image.width, scaled_x + unblur_radius)
        bottom = min(self.display_image.height, scaled_y + unblur_radius)

        if right <= left or bottom <= top:
            return

        unblurred = self.blurred_image.copy()
        crop_box = (left, top, right, bottom)
        cropped_area = self.original_image.crop(crop_box)
        unblurred.paste(cropped_area, crop_box)

        self.image_tk = ImageTk.PhotoImage(unblurred)
        self.canvas.itemconfig(self.image_id, image=self.image_tk)

    def zoom_image(self, event):
        self.scale *= 1.1 if event.delta > 0 else 0.9
        self.apply_zoom()

    def zoom_in(self):
        self.scale *= 1.1
        self.apply_zoom()

    def zoom_out(self):
        self.scale /= 1.1
        self.apply_zoom()

    def apply_zoom(self):
        new_size = (int(self.original_image.width * self.scale), int(self.original_image.height * self.scale))
        self.original_image = self.original_image.resize(new_size, Image.Resampling.LANCZOS)

        if self.blur_enabled:
            self.blurred_image = self.original_image.filter(ImageFilter.GaussianBlur(10))
        else:
            self.blurred_image = self.original_image

        self.display_image = self.blurred_image
        self.image_tk = ImageTk.PhotoImage(self.display_image)
        self.canvas.config(scrollregion=self.canvas.bbox(tk.ALL))
        self.canvas.itemconfig(self.image_id, image=self.image_tk)

    def prompt_password(self):
        password = simpledialog.askstring("Password", "Enter password to toggle view mode:", show='*')
        if password == "your_password":
            self.toggle_blur()
            messagebox.showinfo("Toggle View", "View mode toggled.")
        else:
            messagebox.showwarning("Incorrect Password", "Password is incorrect.")

    def toggle_blur(self):
        self.blur_enabled = not self.blur_enabled
        self.update_display_image()
        self.image_tk = ImageTk.PhotoImage(self.display_image)
        self.canvas.itemconfig(self.image_id, image=self.image_tk)

ImageViewer()