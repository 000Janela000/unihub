// Chrome Extension API types (minimal subset for EMIS integration)
declare namespace chrome {
  namespace runtime {
    const lastError: { message: string } | undefined;
    function sendMessage(
      extensionId: string,
      message: unknown,
      callback: (response: any) => void
    ): void;
  }
}
