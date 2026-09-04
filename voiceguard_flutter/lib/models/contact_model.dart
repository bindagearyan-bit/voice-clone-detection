class ContactModel {
  final String id;
  final String name;
  final String phoneNumber;
  final String relationship;
  final String category;
  final bool isEnrolledVoice;
  final double embeddingConfidence;
  final String note;

  ContactModel({
    required this.id,
    required this.name,
    required this.phoneNumber,
    required this.relationship,
    required this.category,
    required this.isEnrolledVoice,
    required this.embeddingConfidence,
    required this.note,
  });

  factory ContactModel.fromJson(Map<String, dynamic> json) => ContactModel(
    id: json['id'] ?? 'cont_${DateTime.now().millisecondsSinceEpoch}',
    name: json['name'] ?? 'Contact',
    phoneNumber: json['phoneNumber'] ?? '',
    relationship: json['relationship'] ?? 'Friend',
    category: json['category'] ?? 'Family',
    isEnrolledVoice: json['isEnrolledVoice'] ?? true,
    embeddingConfidence: (json['embeddingConfidence'] ?? 99.0).toDouble(),
    note: json['note'] ?? 'Trusted contact',
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'phoneNumber': phoneNumber,
    'relationship': relationship,
    'category': category,
    'isEnrolledVoice': isEnrolledVoice,
    'embeddingConfidence': embeddingConfidence,
    'note': note,
  };
}
