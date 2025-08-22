# 3D Museum Page

## Overview
Uma página ThreeJS que simula um museu 3D com exposições de artefatos, arquitetura clássica e iluminação dramática.

## Features

### 🏛️ **Museum Architecture**
- **Floor**: Piso de madeira clara (30x30 unidades)
- **Walls**: Paredes bege com sombras
- **Ceiling**: Teto claro para iluminação natural
- **Dimensions**: Espaço interno de 30x30x10 unidades

### 🎨 **Display Areas**
- **3 Pedestals**: Bases cilíndricas marrom para exposições
- **Artifacts**: Objetos 3D únicos em cada pedestal
  - Esfera dourada metálica (esquerda)
  - Cubo prateado metálico (direita)
  - Anel vermelho (centro)

### ✨ **Lighting & Atmosphere**
- **Ambient Light**: Iluminação ambiente suave
- **Directional Light**: Luz principal com sombras
- **Environment**: Preset "city" para reflexões realistas
- **Shadows**: Sistema de sombras de alta qualidade

### 🎮 **User Experience**
- **OrbitControls**: Controles completos de câmera
- **Camera Limits**: Zoom entre 5-25 unidades
- **Target Focus**: Câmera focada nos artefatos
- **Responsive**: Adapta-se a qualquer resolução

## Technical Implementation

### **Core Technologies**
- **React Three Fiber**: Engine 3D
- **Three.js**: Biblioteca de gráficos 3D
- **Drei**: Componentes úteis (OrbitControls, Environment)
- **Material-UI**: Sistema de design

### **Component Structure**
```
ThreeDMuseum
├── ThreePageContainer
└── Canvas (3D Scene)
    ├── Lighting System
    │   ├── Ambient Light
    │   └── Directional Light
    ├── Museum Structure
    │   ├── Floor
    │   ├── Walls (3)
    │   └── Ceiling
    ├── Exhibits
    │   ├── Pedestals (3)
    │   └── Artifacts (3)
    ├── Environment
    └── OrbitControls
```

### **Materials & Textures**
- **Floor**: `#8B7355` (Saddle Brown)
- **Walls**: `#D2B48C` (Tan)
- **Pedestals**: `#A0522D` (Sienna)
- **Gold Artifact**: Metallic com roughness baixo
- **Silver Artifact**: Metallic com roughness muito baixo
- **Red Artifact**: Material padrão vibrante

## Navigation Integration

### **Route**
- **Path**: `/3d-museum`
- **Navbar**: Botão rosa com hover effects
- **Active State**: Botão preenchido quando ativo

### **Layout**
- **Height**: `calc(100vh - var(--navbar-height))`
- **Background**: Gradiente escuro elegante
- **Overflow**: Hidden por padrão
- **Responsive**: Funciona em todas as telas

## Future Enhancements

### **Interactive Elements**
- [ ] Clique nos artefatos para informações
- [ ] Animações de rotação dos objetos
- [ ] Sistema de partículas atmosféricas
- [ ] Efeitos de post-processing

### **Content Expansion**
- [ ] Mais salas de exposição
- [ ] Artefatos interativos
- [ ] Sistema de áudio ambiente
- [ ] Informações históricas dos objetos

### **Performance**
- [ ] LOD para objetos distantes
- [ ] Otimização de sombras
- [ ] Compressão de texturas
- [ ] Caching de geometrias

## Usage

### **Access**
1. Navegue para `/3d-museum` na navbar
2. Use mouse para rotacionar a câmera
3. Scroll para zoom in/out
4. Clique e arraste para pan

### **Best Practices**
- Mantenha a câmera focada nos artefatos
- Use zoom para detalhes dos objetos
- Explore diferentes ângulos das paredes
- Aproveite a iluminação dramática
