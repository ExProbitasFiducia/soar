variable "linode_api_token" {
    type = "string"
    default = ""
}

source "linode" "deno_platform" {
    image = "linode/arch"
    image_description = "Deno Platform Host Image"
    image_label = "deno-platform-host
    instace_type = "g6-standard-1"
    linode_token = var.linode_api_token
    region = "us-east"
    boot_config_label = "deno-platform-boot-config
}

build {
    sources = [
        "source.linode.example"
    ]
    provisioner "file" {
        source = "./deno-platform"
        destination = "/srv/"
    }
    provisioner "shell" {
        inline = [
            "sudo pacman -Syu deno --noconfirm"
        ]
    }

}
