import {
  reactExtension,
  Image,
  Text,
  BlockStack
} from '@shopify/ui-extensions-react/admin';

const TARGET = 'admin.app.page';

export default reactExtension(TARGET, () => <WelcomeApp />);

function WelcomeApp() {
  return (
    <BlockStack gap="500" inlineAlignment="center">
      {/* Image component */}
      <Image 
        alt="NovaPrint 3D Printing" 
        source="/assets/icons/64/images.png" 
        width={150}
        height={150}
      />
      
      {/* Text component with larger size */}
      <Text 
        fontWeight="bold" 
        size="large" // This will make the text larger
        emphasis="strong" // This adds emphasis
      >
        This is the welcoming page
      </Text>
    </BlockStack>
  );
}