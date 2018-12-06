# CMS slots
CMS slots contain one or multiple components in the Commerce CMS system. The slots are referenced by name. The components are runtime configurable by business users, therefor the components are rendered dynamically. 

## Cms Slot Directive
The CMS slot directive renders all components of the slot dynamically. The directive can be applied to an `ng-container`, so that there's no additional DOM node being addded while the slot content is rendered. Alternatively, the diretive can be applied on an ordinary DOM element. 

**Examples**

The most simple usage of the cms slot directive is rendering a single slot. The slot name can be provided as an input. 

```html
<ng-container cxCmsSlot="SiteLogo"></ng-container>
```

The example below shows that we can also render multiple slots in one go. 
```html
<div [cxCmsSlot]="['SiteLogo', 'SearchBox']"></div>
```

## Outlets
Outlets are a mechanism to replace or add to the standard layout of the storefront. CMS slots allow for various approaches:
1. replace complete slot
2. add to an existing slot (before or after the slot)
3. Replace a component in the slot
4. Add to an existing component (before or after the component)

All of these options are driven by the `cxCmsSlot` directive. While iterating over the components, the outlets will be rendered. 
